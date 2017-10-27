
var Utils = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var is_fav  = false;
  var is_cart = true;
  Utils.EditMemberMetric(event, is_fav, is_cart, next);
}

