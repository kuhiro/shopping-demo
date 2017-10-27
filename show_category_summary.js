
var Render = require("render");
var Utils  = require("utilities");

module.exports.Go = function(event, context, next) {
  var sid   = Utils.GetUrlParam(event, 'session');
  var cname = Utils.DecodeUri(event, 'name');
  var duo   = Utils.GetUrlBooleanParam(event, 'duo');
  var mini  = Utils.GetUrlBooleanParam(event, 'mini');
  Render.CategorySummaryJson(sid, cname, duo, mini, next);
}

