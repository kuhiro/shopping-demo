#!/bin/bash

PRFX="${1}"

# NOTE: PRICE:    21-220
# NOTE: QUANTITY: 1-100
I=0;
cat all.data | while read pid cat xname pname pid isrc; do 
  I=$[${I}+1];
  echo "PRODUCT REQUEST: ${I}"
  PRICE=$(((RANDOM % 200)+21));
  NUM=$(((RANDOM % 100)+1));
  time curl -g -o - "${PRFX}/edit_product?session=SID-jane&product_id=${I}&name=${pname}&manufacturer=${xname}&price=${PRICE}&quantity=${NUM}&category=${cat}&image_src=${isrc}"
done

