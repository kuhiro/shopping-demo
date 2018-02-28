#!/bin/bash

KCLI="../../kuhiro-client.js"

cat functions.data | while read fname file hndlr path; do
  echo "set function ${fname} path=/${path} handler=${hndlr} body=./${file}" | node $KCLI
done

