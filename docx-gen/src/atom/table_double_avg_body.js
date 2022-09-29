const docx = require("docx");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const {formatDateTable} = require("../utils/date");

function insertMed(i, feed1, feed2){
    let cells = []
    let sum1 = 0
    let sum2 = 0
    if(i % 5 === 0){
        for(let p = i; p < i + 5; p++){
            sum1 += feed1[p].value
            sum2 += feed2[p].value
        }
        cells.push(
            cellCenter({
                rowSpan: 5,
                children: [textTd(Math.round(sum1 / 5 * 100) / 100)]
            }),
        )
        cells.push(
            cellCenter({
                rowSpan: 5,
                children: [textTd(Math.round(sum2 / 5 * 100) / 100)]
            })
        )
        return cells
    }
    return []
}

module.exports = function (feed1, feed2) {
    let rows = [];
    const pf1 = feed1.price_feed
    const pf2 = feed2.price_feed
    for (let i = 0; i < pf1.length; i++) {
        const changeUnits = getChange(pf1, i, feed1.prev_price, false);
        const changePercents = getChange(pf1, i, feed1.prev_price, true);
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pf1[i].date.substring(0, 10)))]
                    }),

                    cellCenter({
                        children: [textTd(pf1[i].value)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits.Text, changeUnits.Color)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents.Text, changePercents.Color)]
                    }),

                    cellCenter({
                        children: [textTd(pf2[i].value)]
                    }),
                    cellCenter({
                        children: [textTd(getChange(pf2, i, feed1.prev_price, false))]
                    }),
                    cellCenter({
                        children: [textTd(getChange(pf2, i, feed1.prev_price, true))]
                    }),

                    ...insertMed(i, pf1, pf2),
                ]
            })
        )
    }

    return rows
}