const docx = require("docx");
const {formatDateTable} = require("../utils/date_format");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const getToFixed = require("../utils/get_to_fixed")
const {FontFamilyExtraBold, FontFamily} = require("../const");

module.exports = function (feed1, feed2, unitChangeRound, percentChangeRound, scale, priceRound) {
    let rows = [];
    const pf1 = feed1.price_feed
    const pf2 = feed2.price_feed
    let fixed
    if (priceRound === undefined){
        fixed = getToFixed([pf1, pf2])
    } else {
        fixed = priceRound
    }


    for (let i = 0; i < pf2.length; i++) {
        const changeUnits1 = getChange(pf1, i, feed1.prev_price, false, unitChangeRound);
        const changePercents1 = getChange(pf1, i, feed1.prev_price, true, percentChangeRound);
        const changeUnits2 = getChange(pf2, i, feed2.prev_price, false, unitChangeRound);
        const changePercents2 = getChange(pf2, i, feed2.prev_price, true, percentChangeRound);
        let font = FontFamily
        if (i === pf2.length-1 && pf2.length >= 8) font = FontFamilyExtraBold
        if (i === 4 && pf2.length === 5) font = FontFamilyExtraBold
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pf1[i].date.substring(0, 10), scale), undefined, undefined, font)]
                    }),

                    cellCenter({
                        children: [textTd(pf1[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits1.Text, changeUnits1.Color, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents1.Text, changePercents1.Color, undefined, font)]
                    }),

                    cellCenter({
                        children: [textTd(pf2[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits2.Text, changeUnits2.Color, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents2.Text, changePercents2.Color, undefined, font)]
                    }),

                ]
            })
        )
    }

    return rows
}