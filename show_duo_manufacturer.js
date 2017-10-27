
var Render = require("render");
var Utils  = require("utilities");

module.exports.Go = function(event, context, next) {
  var sid   = Utils.GetUrlParam(event, 'session');
  var xname = Utils.DecodeUri(event, 'name');
  var num   = Utils.Number(event, 'num');
  var mini  = Utils.GetUrlBooleanParam(event, 'mini');
  Render.DuoManufacturerJson(sid, xname, num, mini, next);
}

