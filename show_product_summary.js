
var Render = require("render");
var Utils  = require("utilities");

module.exports.Go = function(event, context, next) {
  var sid   = Utils.GetUrlParam(event, 'session');
  var pid   = Utils.GetUrlParam(event, 'product_id');
  var short = Utils.GetUrlBooleanParam(event, 'short');
  var show  = Utils.GetUrlBooleanParam(event, 'show');
  var mini  = Utils.GetUrlBooleanParam(event, 'mini');
  Utils.CheckProduct(pid, function(cerr, pdata) {
    if (cerr) next(cerr, null);
    else {
      Render.ProductSummaryJson(sid, short, show, mini, pdata, next);
    }
  });
}

