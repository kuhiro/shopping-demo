#!/bin/bash

PRFX="${1}"

curl -g -o - "${PRFX}/register?username=jane&password=blow"

