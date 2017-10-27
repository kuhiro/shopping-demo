#!/bin/bash

DATE=$(date +%s)
PRFX="https://5ref90y7aa.execute-api.us-east-1.amazonaws.com/shop/"

SPRMS="session=SID-joe&ts=${DATE}"
CPRMS="name=mens_boots"
XPRMS="name=nike"
PPRMS="product_id=2"
DPRMS="num=2"

cat functions.data | grep -v edit_ | grep -v buy_ | grep -v touch_ | \
                     grep -v register | grep -v login | \
while read fname file hndl path; do
  echo $path | grep manufacturer > /dev/null; ISX=$?
  echo $path | grep category     > /dev/null; ISC=$?
  echo $path | grep product      > /dev/null; ISP=$?
  echo $path | grep duo_         > /dev/null; ISD=$?
  URL=${PRFX}${path}"?"${SPRMS}
  if [ $ISX -eq 0 ]; then
    URL=${URL}"&"${XPRMS}
  elif [ $ISC -eq 0 ]; then
    URL=${URL}"&"${CPRMS}
  elif [ $ISP -eq 0 ]; then
    URL=${URL}"&"${PPRMS}
  fi
  if [ $ISD -eq 0 ]; then
    URL=${URL}"&"${DPRMS}
  fi
  echo "${URL}"
done

