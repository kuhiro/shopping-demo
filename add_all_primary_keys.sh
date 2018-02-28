#!/bin/bash

KCLI="../../kuhiro-client.js"

cat Data/primary_keys.txt | while read name val; do
  echo "set table ${name} primary_key=${val}" | node $KCLI
done

