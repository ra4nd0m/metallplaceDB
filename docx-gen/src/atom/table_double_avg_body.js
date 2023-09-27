const docx = require("docx");
const getChange = require("../utils/get_change")
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const {formatDateTable} = require("../utils/date_format");
const getToFixed = require("../utils/get_to_fixed")
const defineFont = require("../utils/define_font")
const {FontFamily, FontFamilyExtraBold, TableCellMarginNil, ThinBorder} = require("../const");

function insertMed(i, feed1, feed2, avgRound){
    let cells = []
    let sum1 = 0
    let sum2 = 0
    if(i % 5 === 0){
        for(let p = i; p < i + 5; p++){
            sum1 += feed1[p].value
            sum2 += feed2[p].value
        }
        let font = FontFamily
        if (i > 4) font = FontFamilyExtraBold
        cells.push(
            new docx.TableCell({
                margins: TableCellMarginNil,
                rowSpan: 5,
                children: [textTd(Math.round(sum1 / 5 * Math.pow(10, avgRound)) / Math.pow(10, avgRound), undefined, avgRound, font)],
                verticalAlign: docx.VerticalAlign.CENTER,
                borders: {
                    top: ThinBorder,
                    bottom: ThinBorder,
                    left: ThinBorder,
                    right: ThinBorder,
                },
            }),
            new docx.TableCell({
                margins: TableCellMarginNil,
                rowSpan: 5,
                children: [textTd(Math.round(sum2 / 5 * Math.pow(10, avgRound)) / Math.pow(10, avgRound), undefined, avgRound, font)],
                verticalAlign: docx.VerticalAlign.CENTER,
                borders: {
                    top: ThinBorder,
                    bottom: ThinBorder,
                    left: ThinBorder,
                    right: ThinBorder,
                },
            }),
        )

        return cells
    }
    return []
}

module.exports = function (feed1, feed2, unitChangeRound, percentChangeRound, avgRound, type) {
    let rows = [];
    const pf1 = feed1.price_feed
    const pf2 = feed2.price_feed
    const fixed = getToFixed([pf1, pf2])
    for (let i = 0; i < pf1.length; i++) {
        const changeUnits1 = getChange(pf1, i, feed1.prev_price, false, unitChangeRound);
        const changePercents1 = getChange(pf1, i, feed1.prev_price, true, percentChangeRound);
        const changeUnits2 = getChange(pf2, i, feed2.prev_price, false, unitChangeRound);
        const changePercents2 = getChange(pf2, i, feed2.prev_price, true, percentChangeRound);
        let font = FontFamily
        if (i >= pf1.length - 5 ) {font = FontFamilyExtraBold}
        rows.push(
            new docx.TableRow({
                children: [
                    cellCenter({
                        children: [textTd(formatDateTable(pf1[i].date.substring(0, 10)),undefined, undefined, font)]
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

                    ...insertMed(i, pf1, pf2, avgRound),
                ]
            })
        )
    }

    return rows
}