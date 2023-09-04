const docx = require("docx");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const {formatDateTable} = require("../utils/date_format");
const getToFixed = require("../utils/get_to_fixed")
const {FontFamily, FontFamilySemiBold} = require("../const");

module.exports = function (input, unitChangeRound, percentChangeRound, type, priceRound) {
    let rows = [];
    const pf = input.price_feed
    let fixed
    if(priceRound === undefined) {
        fixed = getToFixed([pf])
    } else {
        fixed = priceRound
    }

    for (let i = 0; i < pf.length; i++) {
        const changeUnits = getChange(pf, i, input.prev_price, false, unitChangeRound);
        const changePercents = getChange(pf, i, input.prev_price, true, percentChangeRound);
        let font = FontFamily
        if (i === pf.length-1 && pf.length >= 8) font = FontFamilySemiBold
        if (i === 4 && pf.length === 5) font = FontFamilySemiBold

        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pf[i].date.substring(0, 10), type), undefined, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(pf[i].value, undefined, fixed, font)]
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

