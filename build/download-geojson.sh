#!/bin/sh

download () {
    # mkdir -p "layers/$3"
    local out="temp/geojson/$1.geojson"
    local url="https://trp.regionalroads.com/api/?data=$1&format=geojson&download=true"

    echo
    echo "downloading $url"
    curl "$url" --progress-bar > $out
    # jq -c ".features |= [ .[] | if .properties | $2 then . else empty end ] | .name = \"$3\" $4" $1 | ogr2ogr "$out" /vsistdin/
    echo "wrote $out ( $( jq ".features|length" "$out" ) features )"
}

mkdir -p temp/geojson

echo
echo "Cleanup"
rm -v temp/geojson/*

echo
echo "Copying cached datasets"
cp -v cache/* temp/geojson

download GM_Cardlock
download GM_Covid19Relief
download GM_DangerousGoodsRestrictions
# download GM_DangerousGoodsRoutes
download GM_DowntownVancouver
download GM_IndustrialAreas
download GM_InspectionStation
download GM_MetroVancouverBoundary
download GM_MRN
download GM_OSOWRoutes
# download GM_OverheadStructures
download GM_PortofVancouverFacilities
download GM_TemporaryRoadClosures
download GM_TemporaryRoadClosuresExtent
# download GM_TermPermitPoints
# download GM_TermPermitRoutes
download GM_TruckParking
download GM_TruckRoutes