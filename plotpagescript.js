// Retrieve array from session storage
const flagPoints = JSON.parse(sessionStorage.getItem('flag-array'));
// Initialize Google Map
function initMap() {
    // Set the center of the map (you can customize the coordinates)
    const centerCoordinates = {
        lat: parseFloat(sessionStorage.getItem('lat-param')),
        lng: parseFloat(sessionStorage.getItem('lng-param'))
    };
    const map = new google.maps.Map(document.getElementById('map'), {
        center: centerCoordinates,
        zoom: 9
    });
    const icon1 = {flag : 'https://maps.google.com/mapfiles/kml/pal2/icon13.png'};
    const marker = new google.maps.Marker({
        position: {lat:parseFloat(sessionStorage.getItem('lat-param')),
        lng:parseFloat(sessionStorage.getItem('lng-param'))},
        icon: icon1.flag
    });
    marker.setMap(map);
    const sortedFlagPoints = flagSort(centerCoordinates,flagPoints);
    // Plot a polygon using the array from session storage
    const polygon = new google.maps.Polygon({
        paths: sortedFlagPoints,
        map: map,
        editable: false,
        draggable: false
    });
    // Display array elements in the slider box
    const slider = document.getElementById('slider');
    sortedFlagPoints.forEach(function(element) {
        const listItem = document.createElement('div');
        // Assuming each element is an object with lat and lng properties
        listItem.textContent = `Lat: ${element.lat}, Lng: ${element.lng}`;
        slider.appendChild(listItem);
    });
}
function flagSort(center,flagPoints){
    const tempArray = [];
    for (let i = 0;i<flagPoints.length;i++){
        let angle = Math.atan2(flagPoints[i].lat-center.lat,flagPoints[i].lng-center.lng);
        tempArray.push({index:i,value:angle});
    }
    tempArray.sort(function (a, b){return a.value - b.value});
    const result = [];
    for (let i = 0;i<flagPoints.length;i++){
        result.push(flagPoints[tempArray[i].index]);
    }
    return result;
}