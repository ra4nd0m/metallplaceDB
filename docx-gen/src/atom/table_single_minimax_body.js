const docx = require("docx");
const {formatDateTable} = require("../utils/date_format");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const getToFixed = require("../utils/get_to_fixed")
const {FontFamilySemiBold, FontFamily} = require("../const");

module.exports = function (min, max, med, unitChangeRound, percentChangeRound, type) {
    let rows = [];
    const pfMin = min.price_feed
    const pfMax = max.price_feed
    const pfMed = med.price_feed

    const fixed = getToFixed([pfMin, pfMed, pfMax])

    for (let i = 0; i < pfMed.length; i++) {
        const changeUnits = getChange(pfMed, i, med.prev_price, false, unitChangeRound);
        const changePercents = getChange(pfMed, i, med.prev_price, true, percentChangeRound);
        let font = FontFamily
        if (i > 4 && pfMed.length >= 8) font = FontFamilySemiBold
        if (i === 4 && pfMed.length === 5) font = FontFamilySemiBold
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pfMed[i].date.substring(0, 10), type), undefined, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMin[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMax[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMed[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits.Text, changeUnits.Color, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents.Text, changePercents.Color, undefined, font)]
                    }),
                ]
            })
        )
    }

    return rows
}