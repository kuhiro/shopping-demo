#!/bin/bash

PRFX=""

if [ "$1" == "KUHIRO" ]; then
  PRFX="http://localhost:2001"
elif [ "$1" == "WEST-EC2" ]; then
  PRFX="https://p1ommeepx2.execute-api.us-west-1.amazonaws.com/dev/"
elif [ "$1" == "EAST-EC2" ]; then
  PRFX="https://5ref90y7aa.execute-api.us-east-1.amazonaws.com/shop/"
else
  echo "USAGE: $0 [KUHIRO, EAST-EC2, WEST-EC2]"
  exit 1
fi

echo "PREFIX: $PRFX"

time (
  ./populate_inventory.sh "${PRFX}"
  ./scratchpad.sh "${PRFX}"
)

