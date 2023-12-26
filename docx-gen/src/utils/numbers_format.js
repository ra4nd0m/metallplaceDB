module.exports = function (num, fixed){
    if (fixed === 0) num = Math.round(num)
    let numStr = num.toString()
    if (numStr.split(".").length - 1 > 1 || numStr.indexOf("'") !== -1){
        return numStr
    }
    if(num >= 1000){
        let afterComma = ""
        let beforeComma = num
        if(num.toString().indexOf(".") !== -1){
            const numArr = num.toString().split(".")
            beforeComma = numArr[0]
            afterComma = numArr[1]
        }
        const after = beforeComma.toString().slice(-3)
        const before = beforeComma.toString().slice(0, beforeComma.toString().length - 3)
        numStr = before + " " + after
        if(afterComma !== ""){
            numStr += "." + afterComma
        }
    }
    numStr = numStr.replace(".", ",")
    if (fixed !== 0 && fixed !== undefined && fixed !== 0 && typeof fixed === 'number'){
        if (numStr.indexOf(",") === -1){
            numStr += "," + "0".repeat(fixed)
        } else {
            let zeroCount = fixed - numStr.substring(numStr.indexOf(",") + 1).length
            if (zeroCount >= 0){
                numStr += "0".repeat(fixed - numStr.substring(numStr.indexOf(",") + 1).length)
            }
        }
    }
    return numStr
}