#!/bin/bash

SID="SID-shop"

curl -o - "http://localhost:9999/register?username=shop&password=yo"

echo "node yaml2kuhiro.js > functions.data"
node yaml2kuhiro.js > functions.data

echo "./add_all_primary_keys.sh ${SID}"
./add_all_primary_keys.sh "${SID}"

echo "./add_all_modules.sh ${SID}"
./add_all_modules.sh "${SID}"

echo "./add_all_functions.sh ${SID}"
./add_all_functions.sh "${SID}"

curl -o - "http://localhost:9999/rebuild?session=${SID}"
