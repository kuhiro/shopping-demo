#!/bin/bash

SID="$1"

(cd node_modules;
  for file in $(ls | grep -v data); do
    (cd ${file};
      F=$(cat index.js);
      E=$(node ../../../encoder.js "${F}");
      curl -o - "http://localhost:9999/edit_module?name=${file}&body=${E}&session=${SID}";
    )
  done
)

