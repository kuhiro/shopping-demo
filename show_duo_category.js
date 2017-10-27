
var Render = require("render");
var Utils  = require("utilities");

module.exports.Go = function(event, context, next) {
  var sid   = Utils.GetUrlParam(event, 'session');
  var cname = Utils.DecodeUri(event, 'name');
  var num   = Utils.Number(event, 'num');
  var mini  = Utils.GetUrlBooleanParam(event, 'mini');
  Render.DuoCategoryJson(sid, cname, num, mini, next);
}

