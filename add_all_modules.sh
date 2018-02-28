#!/bin/bash

KCLI="../../../kuhiro-client.js"

(cd node_modules;
  for file in $(ls | grep -v data); do
    echo "set module ${file} body=./${file}/index.js" | node $KCLI
  done
)

