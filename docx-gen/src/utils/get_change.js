const {ColorDefault, Red, Green} = require("../const");
module.exports = function (feed, i, prevPrice, getPercent, round) {
    let change
    i === 0 ? change = feed[i].value - prevPrice : change = feed[i].value - feed[i - 1].value
    if (getPercent) {
        let percent = Math.round(change / prevPrice * 1000) / 10
        if (percent > 0) return {Text:`+${format(percent, round)}`, Color: Green};
        if (percent < 0) return {Text:`${format(percent, round)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    } else {
        change = Math.round(change)
        if (change > 0) return {Text:`+${format(change, round)}`, Color: Green};
        if (change < 0) return {Text:`${format(change, round)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    }
}

function format(num, fixed) {
    if(fixed === 0) return num
    let numStr = num.toString()
    if (numStr.indexOf(".") === -1){
        numStr += "." + "0".repeat(fixed)
    } else {
        numStr += "0".repeat(fixed - numStr.substring(numStr.indexOf(".") + 1).length)
    }
    return numStr
}