
var Response = require("response");
var Utils    = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var sid   = Utils.GetUrlParam(event, 'session');
  var xname = Utils.DecodeUri(event, 'name');
  var host  = event.headers.Host;
  var ts    = Utils.GetUrlParam(event, 'ts');
  Response.Manufacturer(sid, host, ts, xname, null, next);
}

