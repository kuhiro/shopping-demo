
var Response = require("response");
var Utils    = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var sid   = Utils.GetUrlParam(event, 'session');
  Utils.ValidateSessionID(sid, function(verr, username) {
    if (verr) next(verr, null);
    else {
      var host = event.headers.Host;
      var ts   = Utils.GetUrlParam(event, 'ts');
      Response.CategoriesHome(sid, host, ts, username, next);
    }
  });
}

