#!/bin/sh

cd temp/layers
find . -name '*geojson' -exec cp -v {} ../../../layers/{} \;
