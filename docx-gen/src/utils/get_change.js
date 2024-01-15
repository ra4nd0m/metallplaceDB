const {ColorDefault, Red, Green} = require("../const");
const formatNum = require("../utils/numbers_format")
function round(v) {
    return (v >= 0 || -1) * Math.round(Math.abs(v));
}

module.exports = function (feed, i, prevPrice, getPercent, symbolsAfterDot) {
    let change
    if (i === 0){
        change = feed[i].value - prevPrice
    } else {
        change = feed[i].value - feed[i - 1].value
        prevPrice = feed[i - 1].value
    }

    if (getPercent) {
        let percent = round(change / prevPrice * 1000) / 10
        if (percent > 0) return {Text:`+${formatNum(percent, symbolsAfterDot)}`, Color: Green};
        if (percent < 0) return {Text:`${formatNum(percent, symbolsAfterDot)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    } else {
        if (symbolsAfterDot !== undefined){
            const n =  Math.pow(10, symbolsAfterDot)
            change = round(change * n) / n
        }
        if (change > 0) return {Text:`+${formatNum(change, symbolsAfterDot)}`, Color: Green};
        if (change < 0) return {Text:`${formatNum(change, symbolsAfterDot)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    }
}
