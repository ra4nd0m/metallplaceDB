const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")

module.exports = function (min, max, med) {
    let rows = [];
    const pfMin = min.price_feed
    const pfMax = max.price_feed
    const pfMed = med.price_feed
    for (let i = 0; i < pfMed.length; i++) {
        const changeUnits = getChange(pfMed, i, med.prev_price, false);
        const changePercents = getChange(pfMed, i, med.prev_price, true);
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(pfMed[i].date.substring(0, 10))]
                    }),
                    cellCenter({
                        children: [textTd(pfMin[i].value)]
                    }),
                    cellCenter({
                        children: [textTd(pfMax[i].value)]
                    }),
                    cellCenter({
                        children: [textTd(pfMed[i].value)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits.Text, changeUnits.Color)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents.Text, changePercents.Color)]
                    }),
                ]
            })
        )
    }

    return rows
}