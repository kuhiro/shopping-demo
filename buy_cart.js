
var Response = require("response");
var Utils    = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var sid   = Utils.GetUrlParam(event, 'session');
  Utils.ValidateSessionID(sid, function(verr, username) {
    if (verr) next(verr, null);
    else {
      if (!username) {
        var response = Response.AuthenticationErrorResponse();
        next(null, response);
      } else {
        Utils.BuyCartItems(username, function(aerr, idata) {
          if (aerr) next(aerr, null);
          else {
            var host = event.headers.Host;
            var ts   = Utils.GetUrlParam(event, 'ts');
            Response.BuyCart(sid, host, ts, username, idata, next);
          }
        });
      }
    }
  });
}

