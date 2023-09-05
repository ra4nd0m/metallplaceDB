const getChange = require("../utils/get_change");
const docx = require("docx");
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const textTdItalic = require("../atom/text_td_small_cursive")
const {FontFamilyThin, FontSizeTd, FontSizeTdMicro, FontFamily, FontFamilyExtraBold} = require("../const");

module.exports = function (body, unitChangeRound, percentChangeRound, priceRound){
    let rows = [];
    body.forEach(m =>{
        const changeUnits1 = getChange(m.Week1Med.price_feed, 0, m.Week1Med.prev_price, false, unitChangeRound);
        const changePercents1 = getChange(m.Week1Med.price_feed, 0, m.Week1Med.prev_price, true, percentChangeRound);
        const changeUnits2 = getChange(m.Week2Med.price_feed, 0, m.Week2Med.prev_price, false, unitChangeRound);
        const changePercents2 = getChange(m.Week2Med.price_feed, 0, m.Week2Med.prev_price, true, percentChangeRound);

        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [
                            textTd(m.Country, undefined, undefined, FontFamilyExtraBold),
                            textTd(m.Type, undefined, undefined, FontFamily),
                        ]
                    }),
                    cellCenter({
                        children: [
                            textTd(m.DeliveryType, undefined, undefined, FontFamilyExtraBold),
                            textTd(m.DeliveryLocation, undefined, undefined, FontFamily),
                        ]
                    }),

                    cellCenter({
                        children: [textTd(m.Week1Min.price_feed[0].value, undefined, priceRound, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week1Max.price_feed[0].value, undefined, priceRound, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week1Med.price_feed[0].value, undefined, priceRound, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits1.Text, changeUnits1.Color,  undefined, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents1.Text, changePercents1.Color, undefined, FontFamily)]
                    }),

                    cellCenter({
                        children: [textTd(m.Week2Min.price_feed[0].value, undefined, priceRound, FontFamilyExtraBold)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week2Max.price_feed[0].value, undefined, priceRound, FontFamilyExtraBold)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week2Med.price_feed[0].value, undefined, priceRound, FontFamilyExtraBold)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits2.Text, changeUnits2.Color, undefined, FontFamilyExtraBold)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents2.Text, changePercents2.Color, undefined, FontFamilyExtraBold)]
                    }),
                ]
            })
        )
    })
    return rows
}