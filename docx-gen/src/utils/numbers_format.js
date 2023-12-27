module.exports = function (num, fixed){
    if (fixed === 0) num = Math.round(num)
    let numStr = num.toString()
    if (numStr.split(".").length - 1 > 1 || numStr.indexOf("'") !== -1){
        return numStr
    }
    numStr = numStr.replace(".", ",")
    if(num >= 1000){
        numStr = addSpaces(numStr)
    }

    if (fixed !== 0 && fixed !== undefined && fixed !== -1 && typeof fixed === 'number'){
        if (numStr.indexOf(",") === -1){
            numStr += "," + "0".repeat(fixed)
        } else {
            let zeroCount = fixed - numStr.substring(numStr.indexOf(",") + 1).length
            if (zeroCount >= 0){
                numStr += "0".repeat(fixed - numStr.substring(numStr.indexOf(",") + 1).length)
            } else {
                numStr = roundFloatFromString(numStr, fixed)
                if(num >= 1000){
                    numStr = addSpaces(numStr)
                }
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
    let afterComma = ""
    let beforeComma = numStr
    if(numStr.indexOf(",") !== -1){
        const numArr = numStr.split(",")
        beforeComma = numArr[0]
        afterComma = numArr[1]
    }
    const after = beforeComma.toString().slice(-3)
    const before = beforeComma.toString().slice(0, beforeComma.toString().length - 3)
    numStr = before + " " + after
    if(afterComma !== ""){
        numStr += "," + afterComma
    }
    return numStr
}