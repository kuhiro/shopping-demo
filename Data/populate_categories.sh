#!/bin/bash

PRFX="${1}"

I=0;
cat categories.data | while read xname; do
  I=$[${I}+1];
  X=$(node ../encoder.js "${xname}");
  echo "CATEGORY REQUEST: ${I} -> ${X}"
  time curl -g -o - "${PRFX}/edit_category?name=${X}&session=SID-jane";
done

