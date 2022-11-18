const docx = require("docx");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const {formatDateTable} = require("../utils/date_format");
const getToFixed = require("../utils/get_to_fixed")

module.exports = function (input, unitChangeRound, percentChangeRound) {
    let rows = [];
    const pf = input.price_feed
    const fixed = getToFixed([pf])
    for (let i = 0; i < pf.length; i++) {
        const changeUnits = getChange(pf, i, input.prev_price, false, unitChangeRound);
        const changePercents = getChange(pf, i, input.prev_price, true, percentChangeRound);
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pf[i].date.substring(0, 10)))]
                    }),
                    cellCenter({
                        children: [textTd(pf[i].value, undefined, fixed)]
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

