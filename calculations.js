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
        DISTANCE[i]=Math.hypot((results[i].location.lat() - (results[0].location.lat())),
            (results[i].location.lng() - (results[0].location.lng())))*LATLNG_TO_METER;
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
    if(checkAntennaAtPeak(MEMO_MATRIX)){
        FLAG_POINTS.push({
            lat:results[results.length-1].location.lat(),
            lng:results[results.length-1].location.lng(),
        });
    }
    else{
    let THETA_RESULTS = calculateTheta({results},MEMO_MATRIX,DISTANCES);
    console.log(findMaxAngleIndex(THETA_RESULTS));
    getFlagLocation({results},findMaxAngleIndex(THETA_RESULTS));
    }
}
function getFlagLocation ({results},thetaResult){
    let flagDistance = (Math.cosh(thetaResult.value)*ALTITUDE)/Math.sin(thetaResult.value);
    let directionX = (results[thetaResult.index].location.lat() - results[0].location.lat())*LATLNG_TO_METER;
    let directionY = (results[thetaResult.index].location.lng() - results[0].location.lng())*LATLNG_TO_METER;
    let length = Math.hypot(directionY,directionX);
    directionX /= length;
    directionY /= length;
    let flagX = ((results[thetaResult.index].location.lat())*LATLNG_TO_METER + flagDistance * directionX)/LATLNG_TO_METER;
    let flagY = ((results[thetaResult.index].location.lng())*LATLNG_TO_METER + flagDistance * directionY)/LATLNG_TO_METER;
    FLAG_POINTS.push({
        lat:flagX,
        lng:flagY
    });
}
function findMaxAngleIndex(thetaResults){
    let tempMax= {index:(SAMPLE_SIZE-1),value:MIN_THETA};
    for (let i =0;i<thetaResults.length;i++){
        if (thetaResults[i].value>MIN_THETA){
            tempMax=thetaResults[i];
        }
    }
    return tempMax;
}