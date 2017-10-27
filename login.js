
var Utils    = require("utilities");
var Data     = require("data");

module.exports.Go = function(event, context, next) {
  Utils.EventCheckUsernamePassword(event, function(gerr, username, password) {
    if (gerr) next(gerr, null);
    else {
      var tname  = 'users';
      var params = {TableName : tname,
                    Key       : {name : username}};
      Data.get(params, function(gerr, data) {
        if (gerr) next(gerr, null);
        else {
          if (!data.Item || (data.Item.password !== password)) {
            var response = Response.AuthenticationErrorResponse();
            next(null, response);
          } else {
            Utils.CreateSessionID(username, function(cerr, sid) {
              if (cerr) next(cerr, null);
              else {
                var redir = Utils.DecodeUri(event, 'redirect');
                var pname = Utils.DecodeUri(event, 'product');
                var host  = event.headers.Host;
                var ts    = Utils.GetUrlParam(event, 'ts');
                Utils.HandleLogin(sid, host, ts, username, redir, pname, next);
              }
            });
          }
        }
      });
    }
  });
}

