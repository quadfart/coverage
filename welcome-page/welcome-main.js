let map;

// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 7
    });
}

// Function to handle confirmation of inputs
function setInputs() {
    // Retrieve values from input fields
    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    const alt = parseFloat(document.getElementById('flight-altitude').value);
    const antennaHeight = parseFloat(document.getElementById('antenna-height').value);
    const rfRange = parseFloat(document.getElementById('rf-range').value);

    // Check if lat and lon are valid numbers
    if (isNaN(lat) || isNaN(lon)||isNaN(alt)||isNaN(antennaHeight)||isNaN(rfRange)) {
        alert('Please Input the Constrains!');
        return;
    }
    if(rfRange<alt){
        alert('Altitude cannot be greater than RF-Range!');
        return;
    }

    // Set the center of the map to the input Latitude and Longitude
    map.setCenter({ lat: lat, lng: lon });

    // Use the values as needed, for example, you can log them to the console
    console.log('Latitude:', lat);
    console.log('Longitude:', lon);
}