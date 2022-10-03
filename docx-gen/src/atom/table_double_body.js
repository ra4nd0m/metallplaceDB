const docx = require("docx");
const {formatDateTable} = require("../utils/date_format");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")

module.exports = function (feed1, feed2) {
    let rows = [];
    const pf1 = feed1.price_feed
    const pf2 = feed2.price_feed
    for (let i = 0; i < pf1.length; i++) {
        const changeUnits1 = getChange(pf1, i, feed1.prev_price, false);
        const changePercents1 = getChange(pf1, i, feed1.prev_price, true);
        const changeUnits2 = getChange(pf2, i, feed2.prev_price, false);
        const changePercents2 = getChange(pf2, i, feed2.prev_price, true);
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
                        children: [textTd(changeUnits1.Text, changeUnits1.Color)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents1.Text, changePercents1.Color)]
                    }),

                    cellCenter({
                        children: [textTd(pf2[i].value)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits2.Text, changeUnits1.Color)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents2.Text, changePercents1.Color)]
                    }),

                ]
            })
        )
    }

    return rows
}