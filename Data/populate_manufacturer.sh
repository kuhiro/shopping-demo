#!/bin/bash

PRFX="${1}"

I=0;
cat brands.data | while read xname; do
  I=$[${I}+1];
  X=$(node ../encoder.js "${xname}");
  echo "MANUFACTURER REQUEST: ${I} -> ${X}"
  time curl -g -o - "${PRFX}/edit_manufacturer?name=${X}&session=SID-jane";
done

