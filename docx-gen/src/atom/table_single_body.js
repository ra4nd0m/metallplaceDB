const docx = require("docx");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")

module.exports = function (input) {
    let rows = [];
    const pf = input.price_feed
    for (let i = 0; i < pf.length; i++) {
        const changeUnits = getChange(pf, i, input.prev_price, false);
        const changePercents = getChange(pf, i, input.prev_price, true);
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(pf[i].date.substring(0, 10))]
                    }),
                    cellCenter({
                        children: [textTd(pf[i].value)]
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

