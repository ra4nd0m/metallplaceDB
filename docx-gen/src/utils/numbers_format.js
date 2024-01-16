module.exports = function (num, fixed){
    if (fixed === 0) num = Math.round(num)
    let numStr = num.toString()
    if (numStr.split(".").length - 1 > 1 || numStr.indexOf("'") !== -1){
        return numStr
    }
    numStr = addSpaces(numStr.replace(".", ","))

    if (fixed !== 0 && fixed !== undefined && fixed !== -1 && typeof fixed === 'number'){
        if (numStr.indexOf(",") === -1){
            numStr += "," + "0".repeat(fixed)
        } else {
            let zeroCount = fixed - numStr.substring(numStr.indexOf(",") + 1).length
            if (zeroCount >= 0){
                numStr += "0".repeat(fixed - numStr.substring(numStr.indexOf(",") + 1).length)
            } else {
                numStr = roundFloatFromString(numStr, fixed)
                numStr += "0".repeat(fixed - numStr.substring(numStr.indexOf(",") + 1).length)
            }
        }
    }
    return numStr
}

function roundFloatFromString(input, decimalPlaces) {
    const floatValue = parseFloat(input.replace(',', '.'));
    const roundedValue = (Math.round(floatValue * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces);
    return roundedValue.replace(".", ",");
}

function addSpaces(numStr) {
    let parts = numStr.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
}