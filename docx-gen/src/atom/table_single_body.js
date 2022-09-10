const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")

module.exports = function (input) {
    let rows = [];
    const pf = input.price_feed
    for (let i = 0; i < pf.length; i++) {
        rows.push(
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [paragraphCentred(pf[i].date.substring(0, 10))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pf[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pf, i, input.prev_price, false))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pf, i, input.prev_price, true))]
                    }),
                ]
            })
        )
    }

    return rows
}

function getChange(feed, i, prevPrice, getPercent) {
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