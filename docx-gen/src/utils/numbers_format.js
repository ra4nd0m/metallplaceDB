module.exports = function (num){
    let numStr = num.toString()
    if (numStr.split(".").length - 1 > 1){
        return numStr
    }
    if(num >= 1000){
        const after = num.toString().slice(-3)
        const before = num.toString().slice(0, num.toString().length - 3)
        numStr = before + " " + after
    }
    return numStr.replace(".", ",")
}