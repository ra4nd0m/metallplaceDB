const {ColorDefault, Red, Green} = require("../const");
module.exports = function (feed, i, prevPrice, getPercent, round) {
    let change
   // i === 0 ? change = feed[i].value - prevPrice : change = feed[i].value - feed[i - 1].value
    if (i === 0){
        change = feed[i].value - prevPrice
    }else {
        change = feed[i].value - feed[i - 1].value
        prevPrice = feed[i - 1].value
    }
    if (getPercent) {
        let percent = Math.round(change / prevPrice * 1000) / 10
        if (percent > 0) return {Text:`+${format(percent, round)}`, Color: Green};
        if (percent < 0) return {Text:`${format(percent, round)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    } else {
        change = Math.round(change * 100) / 100
        if (round !== undefined){
            const n =  Math.pow(10, round)
            change = Math.round(change * n) / n
        }
        if (change > 0) return {Text:`+${format(change, round)}`, Color: Green};
        if (change < 0) return {Text:`${format(change, round)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    }
}

function format(num, round) {
    if(round === 0 || round === undefined) return num
    let numStr = num.toString()
    if (numStr.indexOf(".") === -1){
        numStr += "." + "0".repeat(round)
    } else {
        numStr += "0".repeat(round - numStr.substring(numStr.indexOf(".") + 1).length)
    }
    return numStr
}