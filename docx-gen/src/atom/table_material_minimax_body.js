const getChange = require("../utils/get_change");
const docx = require("docx");
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const textTdItalic = require("../atom/text_td_small_cursive")

module.exports = function (body){
    let rows = [];
    body.forEach(m =>{
        const changeUnits1 = getChange(m.Week1Med.price_feed, 0, m.Week1Med.prev_price, false);
        const changePercents1 = getChange(m.Week1Med.price_feed, 0, m.Week1Med.prev_price, true);
        const changeUnits2 = getChange(m.Week2Med.price_feed, 0, m.Week2Med.prev_price, false);
        const changePercents2 = getChange(m.Week2Med.price_feed, 0, m.Week2Med.prev_price, true);

        rows.push(
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [textTd(m.Country), textTdItalic(m.Type)]
                    }),
                    cellCenter({
                        children: [textTd(m.DeliveryType), textTdItalic(m.DeliveryLocation)]
                    }),

                    cellCenter({
                        children: [textTd(m.Week1Min.price_feed[0].value)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week1Max.price_feed[0].value)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week1Med.price_feed[0].value)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits1.Text, changeUnits1.Color)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents1.Text, changePercents1.Color)]
                    }),

                    cellCenter({
                        children: [textTd(m.Week2Min.price_feed[0].value)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week2Max.price_feed[0].value)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week2Med.price_feed[0].value)]
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
    })
    return rows
}