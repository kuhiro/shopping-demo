#!/bin/bash

KCLI="../../kuhiro-client.js"

echo "./shop_login.sh"
./shop_login.sh

echo "node yaml2kuhiro.js > functions.data"
node yaml2kuhiro.js > functions.data

echo "./add_all_primary_keys.sh"
./add_all_primary_keys.sh

echo "./add_all_modules.sh"
./add_all_modules.sh

echo "./add_all_functions.sh"
./add_all_functions.sh

echo "rebuild"
echo "rebuild" | node $KCLI

