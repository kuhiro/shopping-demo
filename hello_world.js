
var Html = require("html");

module.exports.Go = function(event, context, next) {
  var html     = "HELLO WORLD FROM SHOP";
  var response = Html.CreateServerlessHtmlResponse(200, html);
  next(null, response);
}

