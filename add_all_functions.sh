#!/bin/bash

SID="$1"

cat functions.data | while read fname file hndl path; do
  F=$(cat ${file});
  E=$(node ../encoder.js "${F}");
  curl -o - "http://localhost:9999/edit_function?name=${fname}&url=%2F${path}&handler=${hndl}&body=${E}&session=${SID}";
done

