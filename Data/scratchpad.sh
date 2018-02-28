#!/bin/bash

PRFX="${1}"

curl -g -o - "${PRFX}/home?ts=1";

curl -g -o - "${PRFX}/show_manufacturer?name=adobe&ts=1";
curl -g -o - "${PRFX}/show_manufacturer?name=encore&ts=1";

curl -g -o - "${PRFX}/register?username=joe&password=blow&ts=1";

curl -g -o - "${PRFX}/show_product_detail?product_id=11&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=111&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=211&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=311&session=SID-joe&ts=1";

curl -g -o - "${PRFX}/login?username=joe&password=blow&ts=1"
curl -g -o - "${PRFX}/home?session=SID-joe&ts=1";

curl -g -o - "${PRFX}/edit_asset?asset=favorite&product_id=44&add=true&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/edit_asset?asset=favorite&product_id=144&add=true&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/edit_asset?asset=favorite&product_id=244&add=true&session=SID-joe&ts=1";

curl -g -o - "${PRFX}/show_manufacturers?ts=1"

curl -g -o - "${PRFX}/home?ts=1";

curl -g -o - "${PRFX}/edit_asset?asset=cart&product_id=55&add=true&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/edit_asset?asset=cart&product_id=155&add=true&session=SID-joe&ts=1";

curl -g -o - "${PRFX}/show_cart?session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=55&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=155&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/buy_cart?session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=55&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/show_product_detail?product_id=155&session=SID-joe&ts=1";

curl -g -o - "${PRFX}/show_purchases?session=SID-joe&ts=1";

curl -g -o - "${PRFX}/buy_product?product_id=33&add=true&session=SID-joe&ts=1"
curl -g -o - "${PRFX}/show_purchases?session=SID-joe&ts=1";

curl -g -o - "${PRFX}/edit_asset?asset=cart&product_id=77&add=true&session=SID-joe&ts=1";
curl -g -o - "${PRFX}/edit_asset?asset=cart&product_id=177&add=true&session=SID-joe&ts=1";
