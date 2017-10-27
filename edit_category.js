
var Response = require("response");
var Utils    = require("utilities");
var Data     = require("data");

function persist_category(sid, cname, next) {
  var tname  = 'categories';
  var cdata  = {name        : Utils.SafeEncode(cname),
                quantity    : 0,
                products    : {}};
  var params = {TableName   : tname,
                Item        : cdata};
  Data.put(params, function(serr, sres) {
    if (serr) next(serr, null);
    else {
      var tname   = "globals";
      var fname   = "categories";
      var updates = [];
      var sfname  = Utils.SafeEncode(cname);
      updates.push({operation : "SET", values : [sfname, 1]});
      var params  = {TableName : tname,
                     Key       : {key : fname},
                     Updates   : updates};
      Data.update(params, function(serr, sres) {
        next(serr, cdata);
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
        var cname = Utils.DecodeUri(event, 'name');
        persist_category(sid, cname, function(serr, cdata) {
          if (serr) next(serr, null);
          else {
            var host = event.headers.host;
            var ts   = Utils.GetUrlParam(event, 'ts');
            Response.Category(sid, host, ts, cname, cdata, next);
          }
        });
      }
    }
  });
}

