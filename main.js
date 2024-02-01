//const LAT_LNG = { lat: 15, lng: 0 };
//const RF_RANGE = 10;
const RANGE_RESOLUTION = parseFloat(sessionStorage.getItem('range-res'));
//const ALTITUDE = 300;
const SAMPLE_SIZE = parseFloat(sessionStorage.getItem('sample-size'));
//const ANTENNA_ELEVATION =0;
const FLAG_POINTS =[];
const LATLNG_TO_METER = 111139;
const FT_TO_METER = 0.3048;
//
const LAT_LNG = {
    lat:    parseFloat(sessionStorage.getItem('lat-param')),
    lng:    parseFloat(sessionStorage.getItem('lng-param'))
    };
console.log(LAT_LNG);
const RF_RANGE = (parseFloat(sessionStorage.getItem('rf-param')));
const ANTENNA_ELEVATION = parseFloat(sessionStorage.getItem('ant-param'));
const ALTITUDE = (parseFloat(sessionStorage.getItem('flight-param'))*FT_TO_METER);
//
const MIN_THETA = Math.asin(ALTITUDE/(RF_RANGE))*180/Math.PI;
console.log("Min Theta:",MIN_THETA);
//
function initMap(){
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: LAT_LNG,
        mapTypeId: "terrain",
    });
    const elevator = new google.maps.ElevationService();
    const returnFlagPoints = getResultingPoints(LAT_LNG,(RF_RANGE/LATLNG_TO_METER),RANGE_RESOLUTION,elevator,map);
    sessionStorage.setItem('flag-array', JSON.stringify(returnFlagPoints));
    FLAG_POINTS.push(...returnFlagPoints);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressFill');
    const proceedButton = document.getElementById('proceedButton');

    const desiredArrayLength = RANGE_RESOLUTION; // Set your desired array length

    const interval = setInterval(() => {
        if (FLAG_POINTS.length >= desiredArrayLength) {
            clearInterval(interval);
            proceedButton.classList.add('enabled');
            proceedButton.disabled = false;
        } else {
            const progress = (FLAG_POINTS.length / desiredArrayLength) * 100;
            progressBar.style.width = progress + '%';
        }
    }, 200); // Update every 0.2 second
}
function openNewPage() {
    window.location.href = 'plot.html';
}
window.onload = function () {
    initMap();
    updateProgressBar();
};
