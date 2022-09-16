const {ColorDefault, Red, Green} = require("../const");
module.exports = function (feed, i, prevPrice, getPercent) {
    let change
    i === 0 ? change = feed[i].value - prevPrice : change = feed[i].value - feed[i - 1].value
    if (getPercent) {
        let percent = Math.round(change / prevPrice * 1000) / 10
        if (percent > 0) return {Text:`+${percent}`, Color: Green};
        if (percent < 0) return {Text:`${percent}`, Color: Red};
        return {Text:"-", Color: ColorDefault};
    } else {
        change = Math.round(change * 100) / 100
        if (change > 0) return {Text:`+${change}`, Color: Green};
        if (change < 0) return {Text:change, Color: Red};
        return {Text:"-", Color: ColorDefault};
    }

}