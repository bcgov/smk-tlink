echo
rm "$1.old"
mv -v $1 "$1.old"
echo "$1.old ( $( jq ".features|length" "$1.old" ) features )"

jq -c ".features |= [ .[] | del( .id, .geometry_name ) ] | del( .totalFeatures, .numberMatched, .numberReturned, .timeStamp )" "$1.old" | ogr2ogr "$1" /vsistdin/ -lco COORDINATE_PRECISION=5

echo "normalized $1 ( $( jq ".features|length" "$1" ) features )"
rm "$1.old"
