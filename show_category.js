
var Response = require("response");
var Utils    = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var sid   = Utils.GetUrlParam(event, 'session');
  var cname = Utils.DecodeUri(event, 'name');
  var host  = event.headers.Host;
  var ts    = Utils.GetUrlParam(event, 'ts');
  Response.Category(sid, host, ts, cname, null, next);
}

