#!/bin/bash

PRFX="${1}"

DFILE="demo.data"
#DFILE="all.data"

UFILE="products.urls"
rm ${UFILE}
echo "[" >> ${UFILE}

# NOTE: PRICE:    21-220
# NOTE: QUANTITY: 1-100
I=0;
cat $DFILE | while read pid cat xname pname pid isrc; do 
  if [ $I -ne 0 ]; then
    echo "," >> ${UFILE}
  fi
  I=$[${I}+1];
  PRICE=$(((RANDOM % 200)+21));
  NUM=$(((RANDOM % 100)+1));
  URL="${PRFX}/edit_product?session=SID-jane&product_id=${I}&name=${pname}&manufacturer=${xname}&price=${PRICE}&quantity=${NUM}&category=${cat}&image_src=${isrc}"
  echo "\"${URL}\"" >> ${UFILE}
done
echo "]" >> ${UFILE}

