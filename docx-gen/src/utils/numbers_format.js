module.exports = function (num){
    let numStr = num.toString()
    if(num >= 1000){
        const after = num.toString().slice(-3)
        const before = num.toString().slice(0, num.toString().length - 3)
        numStr = before + " " + after
    }
    return numStr.replace(".", ",")
}