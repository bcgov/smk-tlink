#!/bin/sh

filter () {
    echo
    mkdir -p "temp/layers/$3"
    local out="temp/layers/$3/$3.geojson"
    jq -c ".features |= [ .[] | if .properties | $2 then del( .id, .geometry_name, .properties.Shape_Length, .properties.Shape_Area ) else empty end ] | .name = \"$3\" | .features |= sort_by( .geometry.coordinates ) | del( .totalFeatures, .numberMatched, .numberReturned, .timeStamp ) $4" $1 | ogr2ogr  "$out" /vsistdin/ -lco COORDINATE_PRECISION=5
    echo "$1 ( $( jq ".features|length" "$1" ) ) -> $out ( $( jq ".features|length" "$out" ) )"
}

mkdir -p temp/layers

echo
echo "Cleanup"
rm -vfr temp/layers/*

filter temp/geojson/GM_MetroVancouverBoundary.geojson '.' metro-vancouver-boundary

filter temp/geojson/GM_IndustrialAreas.geojson '.' industrial-area

filter temp/geojson/GM_DowntownVancouver.geojson '.' downtown-vancouver

filter temp/geojson/GM_MRN.geojson '.' major-road-network

filter temp/geojson/GM_TruckRoutes.geojson '.ProvincialJurisdiction == 1' provincial-highway

filter temp/geojson/GM_TruckRoutes.geojson '.RouteType != "Designated Municipal Truck Route with Restrictions" and .AdvisoryType == "Restriction"' truck-advisories-restrictions
filter temp/geojson/GM_TruckRoutes.geojson '.RouteType != "Designated Municipal Truck Route with Restrictions" and .AdvisoryType == "Truck Travel Warning"' truck-advisories-warning

filter temp/geojson/GM_TruckRoutes.geojson '.RouteType == "Designated Municipal Truck Route"' truck-routes-designated-municipal-truck-route
filter temp/geojson/GM_TruckRoutes.geojson '.RouteType == "Designated Municipal Truck Route with Restrictions"' truck-routes-designated-municipal-truck-route-with-restrictions
filter temp/geojson/GM_TruckRoutes.geojson '.RouteType == "Municipal Road with No Truck Travel Restriction" and .AdvisoryType == null' truck-routes-municipal-road-with-no-truck-travel-restriction
filter temp/geojson/GM_TruckRoutes.geojson '.RouteType == "Federal Road with No Truck Travel Restrictions"' truck-routes-federal-road-with-no-truck-travel-restrictions

filter temp/geojson/GM_TruckParking.geojson '.' truck-parking

filter temp/geojson/GM_PortofVancouverFacilities.geojson '.' port-of-vancouver-facilities-terminals

filter temp/geojson/GM_OverheadStructures.geojson '.Posted_Limit != "Y" and ( .Structure_Type == "Advertisement Sign" or .Structure_Type == "Overhead Sign/Signal" or .Structure_Type == "Scale Sign" )' overhead-directional-signs
filter temp/geojson/GM_OverheadStructures.geojson '.Posted_Limit != "Y" and .Structure_Type != "Advertisement Sign" and .Structure_Type != "Overhead Sign/Signal" and .Structure_Type != "Scale Sign"' overhead-structure-without-height-marker
filter temp/geojson/GM_OverheadStructures.geojson '.Posted_Limit == "Y"' overhead-structure-with-height-marker

filter temp/geojson/GM_Cardlock.geojson '.' cardlock

filter temp/geojson/GM_InspectionStation.geojson '.' inspection-station

filter temp/geojson/GM_DangerousGoodsRoutes.geojson '.' dangerous-goods-routes

filter temp/geojson/GM_DangerousGoodsRestrictions.geojson '.' dangerous-goods-restrictions

filter temp/geojson/GM_OSOWRoutes.geojson '.HeightRestriction == "4.88"' oversize-overweight-truck-routes-oah-up-to-4-88-m
filter temp/geojson/GM_OSOWRoutes.geojson '.WidthRestriction == "5.0"' oversize-overweight-truck-routes-oaw-up-to-5-m
filter temp/geojson/GM_OSOWRoutes.geojson '.WeightRestriction == "80000"' oversize-overweight-truck-routes-gvw-up-to-80000-kg
filter temp/geojson/GM_OSOWRoutes.geojson '.WeightRestriction == "85000"' oversize-overweight-truck-routes-gvw-up-to-85000-kg
filter temp/geojson/GM_OSOWRoutes.geojson '.WeightRestriction == "125000"' oversize-overweight-truck-routes-gvw-up-to-125000-kg

# filter temp/geojson/GM_TermPermit_Points.geojson '.Description == "OAW > 3.2m restricted"' term-permit-oaw-over-3-2-m
# filter temp/geojson/GM_TermPermit_Points.geojson '.Description == "OAW > 3.8m restricted"' term-permit-oaw-over-3-8-m
# filter temp/geojson/GM_TermPermit_Points.geojson '.Description == "OS/OW Truck Restriction"' term-permit-os-ow-truck-restriction
filter temp/geojson/GM_TermPermitPoints.geojson '.Description == "TOL Roundabout"' term-permit-roundabout

filter temp/geojson/GM_TermPermitRoutes.geojson '.TermPermitType == "Restricted Term Permit Route"' term-permit-restricted-route
filter temp/geojson/GM_TermPermitRoutes.geojson '.TermPermitType == "Restriction"' term-permit-restriction
filter temp/geojson/GM_TermPermitRoutes.geojson '.TermPermitType == "Term Permit Route"' term-permit-route

filter temp/geojson/GM_TemporaryRoadClosuresExtent.geojson '.Status == "Active"' temporary-road-closure-extent
filter temp/geojson/GM_TemporaryRoadClosures.geojson '.Status == "Active"' temporary-road-closure

filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Cardlock"' covid19-relief-cardlock
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Food Truck"' covid19-relief-food-truck
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Hotel"' covid19-relief-hotel
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Inspection Station"' covid19-relief-inspection-station
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Portable Toilet"' covid19-relief-portable-toilet
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Rest Area"' covid19-relief-rest-area
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Temporary Truck Parking"' covid19-relief-temporary-truck-parking
filter temp/geojson/GM_Covid19Relief.geojson '.Active and .AmenityType == "Tourist Centre"' covid19-relief-tourist-centre
