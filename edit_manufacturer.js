
var Response = require("response");
var Utils    = require("utilities");
var Data     = require("data");

function persist_manufacturer(sid, xname, next) {
  var tname  = 'manufacturers';
  var xdata  = {name        : Utils.SafeEncode(xname),
                quantity    : 0,
                products    : {}};
  var params = {TableName   : tname,
                Item        : xdata};
  Data.put(params, function(serr, sres) {
    if (serr) next(serr, null);
    else {
      var tname   = "globals";
      var fname   = "manufacturers";
      var updates = [];
      var sfname  = Utils.SafeEncode(xname);
      updates.push({operation : "SET", values : [sfname, 1]});
      var params  = {TableName : tname,
                     Key       : {key : fname},
                     Updates   : updates};
      Data.update(params, function(serr, sres) {
        next(serr, xdata);
      });
    }
  });
}

module.exports.Go = function(event, context, next) {
  var sid = Utils.GetUrlParam(event, 'session');
  Utils.ValidateSessionID(sid, function(verr, username) {
    if (verr) next(verr, null);
    else {
      if (!username) { 
        var response = Response.AuthenticationErrorResponse();
        next(null, response);
      } else {
        var xname = Utils.DecodeUri(event, 'name');
        persist_manufacturer(sid, xname, function(serr, xdata) {
          if (serr) next(serr, null);
          else {
            var host = event.headers.Host;
            var ts   = Utils.GetUrlParam(event, 'ts');
            Response.Manufacturer(sid, host, ts, xname, xdata, next);
          }
        });
      }
    }
  });
}

