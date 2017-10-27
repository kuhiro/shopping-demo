
var Render = require("render");
var Utils  = require("utilities");

function add_to_member_metrics(username, pdata, next) {
  if (!username) next(null, null);
  else {
    Utils.AddToRecentlyViewed(username, pdata, function(aerr, ares) {
      if (aerr) next(aerr, null);
      else {
        Utils.AddToRecommended(username, function(serr, sres) {
          next(serr, sres);
        });
      }
    });
  }
}

module.exports.Go = function(event, context, next) {
  var sid = Utils.GetUrlParam(event, 'session');
  var pid = Utils.GetUrlParam(event, 'product_id');
  Utils.CheckProduct(pid, function(cerr, pdata) {
    if (cerr) next(cerr, null);
    else {
      Utils.ValidateSessionID(sid, function(verr, username) {
        if (verr) next(verr, null);
        else {
          add_to_member_metrics(username, pdata, function(serr, sres) {
            if (serr) next(serr, null);
            else {
              Render.TouchProductJson(sid, username, pid, next);
            }
          });
        }
      });
    }
  });
}

