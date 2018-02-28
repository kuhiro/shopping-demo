#!/bin/bash

PRFX="${1}"

./populate_start.sh        ${PRFX}

./populate_manufacturer.sh ${PRFX}
./populate_categories.sh   ${PRFX}

PATH_PRFX="";
RES=$(echo $PRFX | cut -d \/ -f 4);
if [ -n "$RES" ]; then
  PATH_PRFX="/$RES";
fi
echo "./create_product_urls.sh   ${PATH_PRFX}";
./create_product_urls.sh   ${PATH_PRFX}

SP=$(echo $PRFX | cut -f 3 -d \/)
HOST=$(echo $SP | cut -f 1 -d :)
echo $SP | grep ":"
RES=$?
if [ $RES -eq 1 ]; then
  PROTO=$(echo $PRFX | cut -f 1 -d \/)
  if [ "$PROTO" == "https:" ]; then
    PORT=443;
  else
    PORT=80;
  fi
else
  PORT=$(echo $SP | cut -f 2 -d :)
fi
echo "node mget.js $HOST $PORT ./products.urls 10";
node mget.js $HOST $PORT ./products.urls 10


