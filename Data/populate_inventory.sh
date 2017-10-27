#!/bin/bash

PRFX="${1}"

./populate_start.sh ${PRFX}

./populate_manufacturer.sh ${PRFX}
./populate_categories.sh   ${PRFX}

./populate_product.sh ${PRFX}

