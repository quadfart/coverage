
function getElevation({results}){
    const ELEVATION = [results[0].elevation+ANTENNA_ELEVATION];
    for(let i=1;i<results.length-1;i++){
        if(results[i].elevation<0){
            ELEVATION[i]=0;
        }
        else {
            ELEVATION[i] = results[i].elevation;
        }
    }
    console.log("ELEVATION");
    getInfo(ELEVATION);
    return (ELEVATION);
}
function calculateDistance({results}){
    const DISTANCE=[0];
    for (let i =1;i<results.length-1;i++){
        DISTANCE[i]= (haversine_distance(results[i],results[0]))*1000;
    }
    console.log("DISTANCE");
    getInfo(DISTANCE);
    return (DISTANCE);
}
function createMemorizationMatrix (elevationArr){
    let tempElevation = elevationArr[0];
    const MEMO_MATRIX = [true];
    for (let v=1;v<elevationArr.length-1;v++){
        if(elevationArr[v]<tempElevation){
            MEMO_MATRIX.push(false);
        }
        else{
            MEMO_MATRIX.push(true);
            tempElevation=elevationArr[v];
        }
    }
    console.log("MEMO_MATRIX");
    getInfo(MEMO_MATRIX);
    return (MEMO_MATRIX);
}
function calculateTheta({results},memoMatrix,distanceResults){
    const THETA=[{index:0,value:0}];
    for (let i = 1;i<memoMatrix.length;i++){
        if (memoMatrix[i]===true){
            THETA.push({index:i,value:Math.atan2(
                (results[i].elevation - (ANTENNA_ELEVATION+results[0].elevation)),
                    distanceResults[i]-0)*180/Math.PI
            });
        }
        else{}
    }
    console.log("THETA");
    getInfo(THETA);
    return THETA;
}
function checkAntennaAtPeak (memoMatrix){
    for (let b = 1;b<memoMatrix.length-1;b++){
        if (memoMatrix[b]===true){
            return false;
        }
        else{}
    }
    return true;
}
function getFlagTheta({results}){
    let DISTANCES = calculateDistance({results});
    let ELEVATIONS = getElevation({results});
    let MEMO_MATRIX = createMemorizationMatrix(ELEVATIONS);
    let THETA_RESULTS = calculateTheta({results},MEMO_MATRIX,DISTANCES);
    console.log(findMaxAngleIndex(THETA_RESULTS));
    getFlagLocation({results},findMaxAngleIndex(THETA_RESULTS));

}
function getFlagLocation ({results},thetaResult){
    let flagDistance = ALTITUDE/Math.tan((thetaResult.value*Math.PI)/180);
    console.log("flagDist",flagDistance);
        /*(Math.cosh(thetaResult.value)*ALTITUDE)/Math.sin(thetaResult.value);*/
    let heading = findHeading(results[0],results[results.length-1]);
    console.log("heading:",heading);
    const flagP = google.maps.geometry.spherical.computeOffset({lat:results[0].location.lat(),lng:results[0].location.lng()},flagDistance,heading);
    console.log("flagP:",flagP.lat(),flagP.lng());
    FLAG_POINTS.push({lat:flagP.lat(),lng:flagP.lng()});
  /*  let directionX = (results[thetaResult.index].location.lat() - results[0].location.lat())*LATLNG_TO_METER;
    let directionY = (results[thetaResult.index].location.lng() - results[0].location.lng())*LATLNG_TO_METER;
    let length = Math.hypot(directionY,directionX);
    console.log(length);
    directionX /= length;
    directionY /= length;
    console.log(directionX);
    console.log(directionY);
    let flagX = ((results[thetaResult.index].location.lat())*LATLNG_TO_METER + flagDistance * directionX)/LATLNG_TO_METER;
    let flagY = ((results[thetaResult.index].location.lng())*LATLNG_TO_METER + flagDistance * directionY)/LATLNG_TO_METER;
    console.log("flagdist:",flagDistance);
    console.log(results[thetaResult.index].location.lat(),results[thetaResult.index].location.lng());
    console.log(flagDistance*directionX,flagDistance*directionY);
    FLAG_POINTS.push({
        lat:flagX,
        lng:flagY
    });
*/
}
function findMaxAngleIndex(thetaResults){
    let tempMax= {index:(SAMPLE_SIZE-1),value:MIN_THETA};
    for (let i =1;i<thetaResults.length;i++){
        if (thetaResults[i].value>tempMax.value){
            tempMax=thetaResults[i];
        }
    }
    return tempMax;
}
function findHeading (point1,point2){
    const mark1 = new google.maps.LatLng(point1.location.lat(),point1.location.lng());
    const mark2 = new google.maps.LatLng(point2.location.lat(),point2.location.lng());
    return google.maps.geometry.spherical.computeHeading(mark1,mark2);
}
function haversine_distance(mk1, mk2) {
    var R = 6378.1; // Radius of the Earth in km
    var rlat1 = mk1.location.lat() * (Math.PI/180); // Convert degrees to radians
    var rlat2 = mk2.location.lat() * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (mk2.location.lng()-mk1.location.lng()) * (Math.PI/180); // Radian difference (longitudes)

    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}
function calculateDestinationPoint(latitude, longitude, direction, distance) {
    // Radius of the Earth in kilometers
    const earthRadius = 6371.0;

    // Convert input latitude and longitude to radians
    const lat1 = toRadians(latitude);
    const lon1 = toRadians(longitude);

    // Convert direction to radians
    const directionRad = toRadians(direction);

    // Calculate the destination point
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / earthRadius) +
        Math.cos(lat1) * Math.sin(distance / earthRadius) * Math.cos(directionRad));

    const lon2 = lon1 + Math.atan2(Math.sin(directionRad) * Math.sin(distance / earthRadius) * Math.cos(lat1),
        Math.cos(distance / earthRadius) - Math.sin(lat1) * Math.sin(lat2));

    // Convert back to degrees
    const newLatitude = toDegrees(lat2);
    const newLongitude = toDegrees(lon2);

    return {lat:newLatitude, lng:newLongitude};
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Helper function to convert radians to degrees
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}