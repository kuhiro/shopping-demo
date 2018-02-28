#!/bin/bash

PRFX="${1}"

DFILE="demo.data"
#DFILE="all.data"

MIN_RESP=10
FAIL_SLEEP=1

function make_request() {
  I=$1
  URL="$2"
  echo "PRODUCT REQUEST: ${I}"
  RESP=$(curl -g -o - "${PRFX}/edit_product?session=SID-jane&product_id=${I}&name=${pname}&manufacturer=${xname}&price=${PRICE}&quantity=${NUM}&category=${cat}&image_src=${isrc}" 2>&1 | wc -l)
  if [ $RESP -le $MIN_RESP ]; then
    echo -ne "FAIL: ";
    sleep $FAIL_SLEEP
    echo "RETRY: ${I}"
    make_request $I $URL
  else
    echo -ne "SUCCESS: ";
  fi
  echo "PRODUCT REQUEST: ${I}"
}

# NOTE: PRICE:    21-220
# NOTE: QUANTITY: 1-100
I=0;
cat $DFILE | while read pid cat xname pname pid isrc; do 
  I=$[${I}+1];
  PRICE=$(((RANDOM % 200)+21));
  NUM=$(((RANDOM % 100)+1));
  URL="${PRFX}/edit_product?session=SID-jane&product_id=${I}&name=${pname}&manufacturer=${xname}&price=${PRICE}&quantity=${NUM}&category=${cat}&image_src=${isrc}"
  make_request $I $URL
done

