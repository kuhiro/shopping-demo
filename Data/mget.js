'use strict';

var fs         = require('fs');
var http       = require('http');
var https      = require('https');
var Agent      = require('agentkeepalive');
var HttpsAgent = require('agentkeepalive').HttpsAgent;

var Host  = process.argv[2];
var Port  = process.argv[3];
var Ufile = process.argv[4];
var Rps   = process.argv[5];
var Ofst  = process.argv[6];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (!Rps)  Rps = 0;
if (!Ofst) Ofst = 0;

var IsSsl  = (Port == 443);
var Dpms   = Rps ? ((1 / Rps) * 1000) : 0;

var StatusOK   = 200;
var RetrySleep = 1000;

if (!Host || !Port || !Ufile) {
  console.error('Usage: node mget.js Host Port UrlFile [RPS]');
  process.exit(-1);
}

console.log('HOST: ' + Host + ' PORT: ' + Port +  ' URL_FILE: ' + Ufile +
            ' IS(HTTPS): ' + IsSsl);
if (Dpms) console.log('DPMS: ' + Dpms);

var KeepaliveAgent = IsSsl ? new HttpsAgent({keepAlive : true}) :
                             new Agent     ({keepAlive : true});

var Options = {
  host   : Host,
  method : 'GET',
  port   : Port,
  agent  : KeepaliveAgent
};
if (IsSsl) {
  Options.rejectUnauthorized = false;
  Options.requestCert        = true;
  Options.agent              = false;
}

function parse_text_file_to_json(file) {
  var text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) { // File does not exist
    console.error('FILE: (' + file + ') can not be read');
    console.error(e.message);
    return null;
  }
  var json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw(new Error('JSON PARSE ERROR: ' + e));
  }
  return json;
}


function do_next_request(urls, cnt, dur) {
  var to = 0;
  if (Dpms && (dur < Dpms)) to = (Dpms - dur);
  console.log('  DPMS: ' + Dpms + ' DUR: ' + dur + ' TO: ' + to);
  if (!to) sequential_get(urls, cnt);
  else     setTimeout(function() {sequential_get(urls, cnt);}, to);
}

function sequential_get(urls, cnt) {
  var url      = urls.shift();
  if (!url) return;
  console.log('COUNT: ' + cnt + ' URL: ' + url);
  Options.path = url;
  var start    = Date.now();
  var proto    = IsSsl ? https : http;
  var req      = proto.request(Options, function(res) {
    var dur   = Date.now() - start;
    var stat  = res.statusCode;
    console.log('  STATUS: %d, %d ms', stat, dur);
    var pdata = '';
    res.on('data', function(chunk) {
      pdata += chunk;
    });
    res.on('end', function() {
      if (stat == StatusOK) {
        console.log('  POST RESPONSE LENGTH: ' + pdata.length);
        cnt++;
        do_next_request(urls, cnt, dur);
      } else { // FAIL -> TRY AGAIN
        urls.unshift(url);
        console.log('  RETURN STATUS NOT OK -> RETRY');
        setTimeout(function() { sequential_get(urls, cnt); }, RetrySleep);
      }
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    process.exit(1);
  });
  req.end();
}

var urls = parse_text_file_to_json(Ufile);
var cnt  = 0;
if (Ofst) {
  while(Ofst > 0) {
    urls.shift();
    cnt++;
    Ofst--;
  }
}
sequential_get(urls, cnt);

