function getResultingPoints(origin, radius, numPoints,elevator,map) {
    const {lat:x0,lng: y0} = origin;

    const angleIncrement = (2 * Math.PI) / numPoints;

    for (let i = 0; i < numPoints; i++) {
        const theta = i * angleIncrement;
        const x = x0 + radius * Math.cos(theta);
        const y = y0 + radius * Math.sin(theta);
        generatePathsAndElevation([{
            lat:LAT_LNG.lat,
            lng:LAT_LNG.lng},{
            lat:x,
            lng:y
        }],SAMPLE_SIZE,elevator,map);
    }
    console.log("getResultFunction")
    getInfo(FLAG_POINTS);
    return FLAG_POINTS;
}
function generatePathsAndElevation (path,smplSize,elevator){
    elevator.getElevationAlongPath({
        path: path,
        samples : smplSize,
    }).then(getFlagTheta);
}
