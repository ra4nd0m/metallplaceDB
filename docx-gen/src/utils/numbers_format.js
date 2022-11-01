module.exports = function (num, fixed){
    let numStr = num.toString()
    if (numStr.split(".").length - 1 > 1){
        return numStr
    }
    if(num >= 1000){
        const after = num.toString().slice(-3)
        const before = num.toString().slice(0, num.toString().length - 3)
        numStr = before + " " + after
    }
    numStr = numStr.replace(".", ",")
    if (fixed !== 0 && fixed !== undefined){
        if (numStr.indexOf(",") === -1){
            numStr += "," + "0".repeat(fixed)
        } else {
            numStr += "0".repeat(fixed - numStr.substring(numStr.indexOf(",") + 1).length)
        }
    }
    return numStr
}