
var Response = require("response");
var Utils    = require("utilities");
var Html     = require("html");
var Errors   = require("errors");
var Data     = require("data");

function initialize_registration_data(username, password, next) {
  var tname    = 'users';
  var udata    = {name      : username,
                  password  : password};
  var params   = {TableName : tname,
                  Item      : udata};
  Data.put(params, function(serr, sres) { // INITIALIZE USER
    if (serr) next(serr, null);
    else {
      var tname  = 'purchases';
      var rdata  = {username  : username,
                    orders    : []};
      var params = {TableName : tname,
                    Item      : rdata};
      Data.put(params, next); // INITIALIZE PURCHASES
    }
  });
}

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
          var udata = data.Item;
          if (udata) {
            var html     = Errors.Message.RepeatRegistration;
            var response = Html.CreateServerlessHtmlResponse(200, html);
            next(null, response);
          } else {
            initialize_registration_data(username, password, 
            function(serr, sres) {
              if (serr) next(serr, null);
              else {
                Utils.CreateSessionID(username, function(cerr, sid) {
                  if (cerr) next(cerr, null);
                  else {
                    var redir = Utils.DecodeUri(event, 'redirect');
                    var pname = Utils.DecodeUri(event, 'product');
                    var host  = event.headers.host;
                    var ts    = Utils.GetUrlParam(event, 'ts');
                    Utils.HandleLogin(sid, host, ts, username, 
                                      redir, pname, next);
                  }
                });
              }
            });
          }
        }
      });
    }
  });
}

