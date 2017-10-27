#!/bin/bash

SID="$1"

cat Data/primary_keys.txt | while read name val; do
  curl -o - "http://localhost:9999/edit_table?name=${name}&value=${val}&session=${SID}";
done

