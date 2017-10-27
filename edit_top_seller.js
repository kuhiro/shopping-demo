
var Utils = require("utilities");

module.exports.Go = function(event, context, next) {
  var is_fav  = false;
  var is_cart = false;
  Utils.EditMemberMetric(event, is_fav, is_cart, next);
}

