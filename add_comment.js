
var Utils = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var is_fav     = false;
  var is_cart    = false;
  var is_rate    = false;
  var is_comment = true;
  Utils.EditMemberMetric(event, is_fav, is_cart, is_rate, is_comment, next);
}

