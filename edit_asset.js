
var Utils = require("utilities");

module.exports.Go = function(event, context, next) {
  var tresp = Utils.CheckTimestampRedirect(event);
  if (tresp) return next(null, tresp);
  var asset      = Utils.GetUrlParam(event, 'asset');
  var is_fav     = (asset === "favorite");
  var is_cart    = (asset === "cart");
  var is_rate    = false;
  var is_comment = false;
  Utils.EditMemberMetric(event, is_fav, is_cart, is_rate, is_comment, next);
}

