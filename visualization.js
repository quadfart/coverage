function printPolyline(path,map){
    return (new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#800080",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    }));
}
function getInfo(info){
    console.log(info);
}