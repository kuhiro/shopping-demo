
var Render = require("render");
var Utils  = require("utilities");

module.exports.Go = function(event, context, next) {
  var sid = Utils.GetUrlParam(event, 'session');
  var mini = Utils.GetUrlBooleanParam(event, 'mini');
  Render.TopCategoriesJson(sid, mini, next);
}

