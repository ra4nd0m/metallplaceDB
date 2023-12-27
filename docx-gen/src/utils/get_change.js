const {ColorDefault, Red, Green} = require("../const");
const formatNum = require("../utils/numbers_format")
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
        if (percent > 0) return {Text:`+${formatNum(percent, round)}`, Color: Green};
        if (percent < 0) return {Text:`${formatNum(percent, round)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    } else {
        change = Math.round(change * 100) / 100
        if (round !== undefined){
            const n =  Math.pow(10, round)
            change = Math.round(change * n) / n
        }
        if (change > 0) return {Text:`+${formatNum(change, round)}`, Color: Green};
        if (change < 0) return {Text:`${formatNum(change, round)}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    }
}
