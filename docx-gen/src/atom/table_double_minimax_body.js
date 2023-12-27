const docx = require("docx");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const {formatDateTable} = require("../utils/date_format");
const getToFixed = require("../utils/get_to_fixed")
const {FontFamily, FontFamilyExtraBold} = require("../const");
const defineFont = require("../utils/define_font");

module.exports = function (min1, max1, med1, min2, max2, med2, unitChangeRound, percentChangeRound, priceRound, type) {
    let rows = [];

    const pfMin1 = min1.price_feed
    const pfMax1 = max1.price_feed
    const pfMed1 = med1.price_feed

    const pfMin2 = min2.price_feed
    const pfMax2 = max2.price_feed
    const pfMed2 = med2.price_feed

    let fixed = getToFixed([pfMin1, pfMax1, pfMed1, pfMin2, pfMax2, pfMed2])
    if (priceRound !== undefined) {
        fixed = priceRound
    }

    for (let i = 0; i < pfMed1.length; i++) {
        const changeUnits1 = getChange(pfMed1, i, med1.prev_price, false, unitChangeRound);
        const changePercents1 = getChange(pfMed1, i, med1.prev_price, true, percentChangeRound);

        const changeUnits2 = getChange(pfMed2, i, med2.prev_price, false, unitChangeRound);
        const changePercents2 = getChange(pfMed2, i, med2.prev_price, true, percentChangeRound);

        let font = defineFont(i, pfMed1, type)
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pfMed1[i].date.substring(0, 10)), undefined, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMin1[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMax1[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMed1[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits1.Text, changeUnits1.Color, undefined, font)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents1.Text, changePercents1.Color, undefined, font)]
                    }),


                    cellCenter({
                        children: [textTd(pfMin2[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMax2[i].value, undefined, fixed, font)]
                    }),
                    cellCenter({
                        children: [textTd(pfMed2[i].value, undefined, fixed, font)]
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