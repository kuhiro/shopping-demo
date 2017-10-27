
var Response = require("response");
var Utils    = require("utilities");
var Data     = require("data");

function update_my_products(name, pid, num, tname, next) {
  var updates = [];
  var fname   = "products";
  var qfname  = fname + "." + pid;
  updates.push({operation : "SET",       values : [qfname,     num]});
  updates.push({operation : "INCREMENT", values : ["quantity", num]});
  var params  = {TableName : tname,
                 Key       : {name : Utils.SafeEncode(name)},
                 Updates   : updates};
  Data.update(params, next);
}

function update_categories_products(cname, pid, num, next) {
  var tname = 'categories';
  update_my_products(cname, pid, num, tname, next);
}

function update_manufacturer_products(xname, pid, num, next) {
  var tname = 'manufacturers';
  update_my_products(xname, pid, num, tname, next);
}

function update_quantities(cname, xname, pid, num, next) {
  update_categories_products(cname, pid, num, function(serr, sres) {
    if (serr) next(serr, null);
    else {
      update_manufacturer_products(xname, pid, num, next);
    }
  });
}

function record_product_id(pid, next) {
  var tname   = "globals";
  var fname   = "products";
  var updates = [];
  updates.push({operation : "SET", values : ["top_product_id", pid]});
  var params  = {TableName : tname,
                 Key       : {key : fname},
                 Updates   : updates};
  Data.update(params, next);
}

function perist_product_record(pid, event, next) {
  var pname  = Utils.DecodeUri(event, 'name');
  var xname  = Utils.DecodeUri(event, 'manufacturer');
  var num    = Utils.Number   (event, 'quantity');
  var cat    = Utils.DecodeUri(event, 'category');
  var isrc   = Utils.DecodeUri(event, 'image_src');
  var price  = Utils.GetUrlParam(event, 'price');;
  var tname  = 'products';
  var pdata  = {id           : pid,
                name         : Utils.SafeEncode(pname),
                manufacturer : xname,
                category     : cat,
                image_src    : isrc,
                price        : price,
                quantity     : num};
  var params = {TableName    : tname,
                Item         : pdata};
  Data.put(params, function(serr, sres) {
    next(serr, pdata);
  });
}

function persist_product(pid, event, next) {
  var cname = Utils.DecodeUri(event, 'category');
  var xname = Utils.DecodeUri(event, 'manufacturer');
  var num   = Utils.Number   (event, 'quantity');
  update_quantities(cname, xname, pid, num, function(serr, sres) {
    if (serr) next(serr, null);
    else {
      record_product_id(pid, function(serr, sres) {
        if (serr) next(serr, null);
        else {
          perist_product_record(pid, event, next);
        }
      });
    }
  });
}

module.exports.Go = function(event, context, next) {
  var sid = Utils.GetUrlParam(event, 'session');
  var pid = Utils.GetUrlParam(event, 'product_id');
  Utils.ValidateSessionID(sid, function(verr, username) {
    if (verr) next(verr, null);
    else {
      if (!username) { 
        var response = Response.AuthenticationErrorResponse();
        next(null, response);
      } else {
        persist_product(pid, event, function(perr, pdata) {
          if (perr) next(perr, null);
          else {
            var host  = event.headers.Host;
            var ts    = Utils.GetUrlParam(event, 'ts');
            var touch = false;
            Response.ShowProduct(sid, host, ts, username, pid, pdata, touch,
                                 next);
          }
        });
      }
    }
  });
}

