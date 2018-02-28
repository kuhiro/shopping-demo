"use strict"

var readline = require('readline');

var rl = readline.createInterface({
  input  : process.stdin,
  output : process.stdout
});

function program_exit() {
  rl.close();
  process.exit(0);
}

var CatCounter   = {};
var BrandCounter = {};

function increment_counter(c, id) {
  if (!c[id]) c[id] = 0;
  c[id]++;
}

var Threshold = 15;

function prompt() {
  rl.question('kuhiro> ', function(line) {
    if (!line.length) program_exit();
    var args  = line.split(" ");
    var pid   = Number(args[0]);
    var cat   = args[1];
    var b     = args[2];
    increment_counter(CatCounter,   cat);
    increment_counter(BrandCounter, b);
    if (BrandCounter[b] < Threshold ||
        CatCounter[cat] < Threshold) console.error(line);
    prompt();
  });
}

prompt();

