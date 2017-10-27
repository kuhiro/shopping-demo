
var Render = require("render");
var Utils  = require("utilities");

module.exports.Go = function(event, context, next) {
  var sid = Utils.GetUrlParam(event, 'session');
  Utils.ValidateSessionID(sid, function(verr, username) {
    if (verr) next(verr, null);
    else {
      if (!username) {
        var response = Response.AuthenticationErrorResponse();
        next(null, response);
      } else {
        Render.MemberInfoJson(sid, username, next);
      }
    }
  });
}
