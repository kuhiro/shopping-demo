"use strict"

var yaml = require('js-yaml');
var fs   = require('fs');

function parse_yaml(fname) {
  var doc = null;
  try {
    doc = yaml.safeLoad(fs.readFileSync(fname, 'utf8'));
    return doc;
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

function log(doc) {
  var txt = JSON.stringify(doc, null, "    ") + "\n";
  console.log(txt);
}

var doc   = parse_yaml('./serverless.yml');
var funcs = doc.functions;
for (var fname in funcs) {
  var func = funcs[fname];
  var hndl = func.handler;
  var dots = hndl.split(".");
  var file = dots[0] + ".js";
  var es   = func.events;
  var path = es[0].http.path;
  console.log(fname + ' ' + file + ' ' +
              encodeURIComponent(hndl) + ' ' + encodeURIComponent(path));
}

