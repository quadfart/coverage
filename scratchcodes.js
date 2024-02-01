function constructCalcMemo(distances,elevations,thetas){
let n = thetas.length;
let calcMemo =[];
    for (let i = 0; i < n; i++) {
        calcMemo[i] = [];
        for (let j = 0; j < n; j++) {
            calcMemo[i][j] = 0;
        }
    }
// Fill upper triangular part and set main diagonal to zero
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // Set values in the upper triangular part
            if(distances[j]*Math.tan(thetas[i].value)>elevations[j]){
                calcMemo[i][j] = 1;
            }
            else{
                calcMemo[i][j]=0;
            }
            // Set main diagonal to zero
            calcMemo[i][i] = 0;
        }
    }
    for(let i=0;i<n;i++){
        calcMemo[0][i]=0;
    }
    console.log(calcMemo.map(row => row.join(' ')).join('\n'));
}





/*

for (let i=1;i<THETA_RESULTS.length-1;i++){
    for (let j=i+1;j<THETA_RESULTS.length-1;j++){
        if(DISTANCES[j]*Math.tan(THETA_RESULTS[i].value)<ELEVATIONS[j]){
            break;
        }
        else{
            getFlagLocation({results},THETA_RESULTS[i]);
        }
    }
}


 */