let map;

// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.89695067480298, lng: 32.771790515301554 },
        zoom: 8
    });
}

// Function to handle confirmation of inputs
function setInputs() {
    // Retrieve values from input fields
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const alt = parseFloat(document.getElementById('flight-altitude').value);
    const antennaHeight = parseFloat(document.getElementById('antenna-height').value);
    const rfRange = parseFloat(document.getElementById('rf-range').value);
    const rangeRes = parseFloat(document.getElementById('slider2').value);
    const sampleSize = parseFloat(document.getElementById('slider1').value);

    // Check if lat and lng are valid numbers
    if (isNaN(lat) || isNaN(lng)||isNaN(alt)||isNaN(antennaHeight)||isNaN(rfRange)) {
        alert('Incorrect Inputs!');
        return;
    }
    if(rfRange<(alt*0.3048)){
        alert('Altitude cannot be greater than RF-Range!');
        return;
    }
    sessionStorage.setItem('lat-param',lat);
    sessionStorage.setItem('lng-param',lng);
    sessionStorage.setItem('flight-param',alt);
    sessionStorage.setItem('ant-param',antennaHeight);
    sessionStorage.setItem('rf-param',rfRange);
    sessionStorage.setItem('range-res',rangeRes);
    sessionStorage.setItem('sample-size',sampleSize);
    // Set the center of the map to the input Latitude and Longitude
    map.setCenter({ lat: lat, lng: lng });
    // Use the values as needed, for example, you can log them to the console
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);
    console.log(sessionStorage.getItem('lat-param'));
    console.log(sessionStorage.getItem('lng-param'));
}