#!/bin/bash

PFILE=/usr/local/openresty/nginx/html/static/precache.html

./create_precache_dynamic_urls.sh > precache_dynamic_urls.data

function write_header() {
  echo "<html><head>";
  echo "<script>";
  echo "  var NumDynamicRequests = 0, NumDynamicResponses = 0;"
  echo "  var NumStaticRequests  = 0, NumStaticResponses  = 0;"
  echo "  var OnCompleteRedirect = 'http://west-ec2.kuhiro.com/home?session=SID-joe';"
  echo "  function client_replace_div_text(txt, id) { var o = document.getElementById(id); o.innerText = txt; }"
  echo "  function check_request_response_counts() { if (NumDynamicRequests && NumStaticRequests && (NumDynamicRequests === NumDynamicResponses) && (NumStaticRequests === NumStaticResponses)) window.location.replace(OnCompleteRedirect); }"
  echo "  function DynamicRequestListener () { NumDynamicResponses++; client_replace_div_text(NumDynamicResponses, 'DynamicResponses'); check_request_response_counts();}";
  echo "  function StaticRequestListener () { NumStaticResponses++; client_replace_div_text(NumStaticResponses, 'StaticResponses'); check_request_response_counts();}";
  echo "</script>";
  echo "</head><body>";
}

function write_body() {
  echo '<span id="DynamicRequests">0</span> dynamic requests&nbsp;'
  echo '<span id="DynamicResponses">0</span> dynamic responses<br/>';
  echo '<span id="StaticRequests">0</span> static requests&nbsp;'
  echo '<span id="StaticResponses">0</span> static responses';
}

function write_footer() {
  echo "</body></html>";
}

function write_ajax_call() {
  URL="$1"
  TYPE="$2"
cat << EOF
<script>
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", ${TYPE}RequestListener);
  oReq.open("GET", "${URL}");
  oReq.send();
  Num${TYPE}Requests++;
  client_replace_div_text(Num${TYPE}Requests, '${TYPE}Requests');
</script>
EOF
}

(
  write_header
  write_body
  cat precache_dynamic_urls.data | while read url; do
    write_ajax_call "${url}" "Dynamic"
  done
  cat Data/raw_images.data | cut -f 5- -d \/ | while read path; do
    URL="http://shop.kuhiro.com/static/${path}"
    write_ajax_call "${URL}" "Static"
  done
  write_footer
) > ${PFILE}

echo "SUCCESS: written to $PFILE"
