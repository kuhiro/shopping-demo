
var Response = require("response");
var Utils    = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var sid   = Utils.GetUrlParam(event, 'session');
  var pid   = Utils.GetUrlParam(event, 'product_id');
  Utils.CheckProduct(pid, function(cerr, pdata) {
    if (cerr) next(cerr, null);
    else {
      Utils.ValidateSessionID(sid, function(verr, username) {
        if (verr) next(verr, null);
        else {
          var host  = event.headers.Host;
          var ts    = Utils.GetUrlParam(event, 'ts');
          var touch = true;
          Response.ShowProduct(sid, host, ts, username, pid, pdata, touch,
                               next);
        }
      });
    }
  });
}

