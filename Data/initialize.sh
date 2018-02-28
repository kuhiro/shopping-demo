#!/bin/bash

PRFX=""

if [ "$1" == "KUHIRO" ]; then
  PORT=$(docker ps --filter name=kuhiro-shop-engine --format "{{.Ports}}" | cut -f 2 -d \> | cut -f 1 -d \/)
  PRFX="http://localhost:${PORT}"
elif [ "$1" == "EAST-EC2" ]; then
  PRFX="https://5ref90y7aa.execute-api.us-east-1.amazonaws.com/shop/"
else
  echo "USAGE: $0 [KUHIRO, EAST-EC2]"
  exit 1
fi

echo "PREFIX: $PRFX"

time (
  ./populate_inventory.sh "${PRFX}"
  ./scratchpad.sh "${PRFX}"
)

