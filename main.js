const LAT_LNG = { lat: 15, lng: 0 };
const RF_RANGE = 10;
const RANGE_RESOLUTION = 5;
const ALTITUDE = 300;
const SAMPLE_SIZE = 12;
const ANTENNA_ELEVATION =0;
const FLAG_POINTS =[];
const LATLNG_TO_METER = 111139;
const MIN_THETA = Math.asin(ALTITUDE/(RF_RANGE*LATLNG_TO_METER))*180/Math.PI;
const FT_TO_METER = 0.3048;
function initMap(){
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: LAT_LNG,
        mapTypeId: "terrain",
    });
    const elevator = new google.maps.ElevationService();
    const returnFlagPoints = getResultingPoints(LAT_LNG,RF_RANGE,RANGE_RESOLUTION,elevator,map);
    console.log("MAIN");
    getInfo(returnFlagPoints);
    if(returnFlagPoints.length===RANGE_RESOLUTION){
        setPoly(map,returnFlagPoints);
    }
    else{
        console.log("damn bruv");
    }
}
window.initMap=initMap;

function setPoly(map,path){
    const drawFlagsPoly = new google.maps.Polygon({
        paths: path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
    });
    drawFlagsPoly.setMap(map);
}