
var Html = require("html");

module.exports.Go = function(event, context, next) {
  var js =
     `function replaceInnerHTML(od, html) {
        var nd       = od.cloneNode(false);
        nd.innerHTML = html;
        od.parentNode.replaceChild(nd, od);
      };
      function client_replace_div_html(html, id) {
        var o = document.getElementById(id);
        replaceInnerHTML(o, html);
      }
      function client_replace_div_text(txt, id) {
        var o       = document.getElementById(id);
        o.innerText = txt;
      }
      function client_parse_json_response_to_div(txt, tid) {
        var r;
        try { r = JSON.parse(txt); }
        catch(e) { return console.error(e.message); }
        if (r.dynamic) {
          var htmls = r.html;
          var html  = htmls.join('');
          client_replace_div_html(html, tid);
        } else {
          var lines = r.text;
          var txt   = '';
          for (var i = 0; i < lines.length; i++) {
            var line  = lines[i];
            txt      += line;
            if (i !== (lines.length -1)) txt += "\\n";
          }
          client_replace_div_text(txt, tid);
        }
        var scripts = r.script;
        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];
          var sid    = script.id;
          var surl   = script.url;
          client_add_xml_request(surl, sid);
        }
      }
      function client_add_div(pid, id, w, h, clm) {
        var nd = document.createElement("div");
        nd.id  = id;
        if (w)   nd.style.width      = w;
        if (h)   nd.style.height     = h;
        if (clm) nd.style.marginLeft = clm;
        var o  = pid ? document.getElementById(pid) :
                       document.body;
        o.appendChild(nd);
      }
      function client_add_child_div(id, tid, ndiv, w, h, clm) {
        var gclm = (2 * clm);
        for (var i = 0; i < ndiv; i++) {
          var cid = id + "-" + i + "-text";
          client_add_div(id, cid, w, h, gclm);
        }
      }
      var StartTime = null;
      function client_record_start_time(ts) {
        StartTime = ts;
      }
      function client_update_load_duration() {
        var ts       = Date.now();
        var diff     = ts - StartTime;
        var id       = "page_load_duration";
        var el       = document.getElementById(id);
        var secs     = (diff / 1000);
        el.innerText = "DURATION: " + secs.toFixed(3);
      }
      var NumRequests = 0;
      function client_add_xml_request(url, tid) {
        function reqListener () {
          NumRequests--;
          if (NumRequests === 0) client_update_load_duration();
          var txt = this.responseText;
          client_parse_json_response_to_div(txt, tid);
        }
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url);
        oReq.send();
        NumRequests++;
      }
      function client_add_xml_json_request(url, id, w, th, ph, ch, clm,
                                           adiv, ndiv) {
        var tid  = id + "-text";
        var n    = ndiv;
        if (adiv) {
          client_add_div(null, tid, w, th, clm);
          client_add_div(null,  id, w, ph, clm);
        }
        if (ndiv) {
          client_add_child_div(id, tid, n, w, ch, clm);
        }
        client_add_xml_request(url, tid);
      }
      function client_require_query_variable(search, name, val) {
        var query   = search.substring(1);
        var vars    = query.split('&');
        var nsearch = "?";
        var hit     = false;
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) === name) {
            hit      = true;
            nsearch += name    + "=" + val;
          } else {
            nsearch += pair[0] + "=" + pair[1];
          }
          if (i !== (vars.length - 1)) nsearch += "&";
        }
        if (!hit) {
          if (nsearch.length === 0) nsearch  = name + "=" + val;
          else                      nsearch += "&" + name + "=" + val;
        }
        return nsearch;
      }
      function debug_client_change_domain(loc, t, path, search, url) {
        alert('LPATH: ' + loc.pathname + ' LSEARCH: ' + loc.search +
              ' T: ' + t + ' PATH: ' + path + ' SEARCH: ' + search +
              ' URL: ' +url);
      }
      function client_change_domain(val, cname, t) {
        var loc = window.location;
        var search;
        if (!loc.search) {
          search = '?customer=' + cname;
        } else {
          search = client_require_query_variable(loc.search, "customer", cname);
        }
        search   = client_require_query_variable(search, "ts", Date.now());
        var path = loc.pathname;
        if        (t === "K2A") {
          path = "shop" + path;
        } else if (t === "A2K") {
          path = path.substring(path.lastIndexOf('/') + 1);
        }
        var url = val + path + search;
        //debug_client_change_domain(loc, t, path, search, url);
        window.location.replace(url);
        return false;
      }
      function client_redirect_with_timestamp() {
        var loc     = window.location;
        var search  = loc.search ? loc.search + "&" : "?";
        search     += "ts=" + Date.now();
        var url     = loc.pathname + search;
        window.location.replace(url);
      }
      function client_request(path, search) {
        var url = path;
        if (search.length) url += "?" + search + "&ts=" + Date.now();
        else               url += "?ts=" + Date.now();
        //alert('path: ' + path + ' search: ' + search + ' url: ' + url);
        window.location.replace(url);
      }
      `;
  var response = Html.CreateServerlessJavascriptResponse(200, js);
  next(null, response);
}

