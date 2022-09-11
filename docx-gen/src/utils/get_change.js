module.exports = function (feed, i, prevPrice, getPercent) {
    let change
    i === 0 ? change = feed[i].value - prevPrice : change = feed[i].value - feed[i - 1].value
    if (getPercent) {
        let percent = Math.round(change / prevPrice * 1000) / 10
        if (percent > 0) return `+${percent}`;
        if (percent < 0) return percent;
        return "-";
    } else {
        change = Math.round(change * 100) / 100
        if (change > 0) return `+${change}`;
        if (change < 0) return change;
        return "-";
    }

}