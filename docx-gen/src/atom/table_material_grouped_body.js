const getChange = require("../utils/get_change");
const docx = require("docx");
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")
const textTdItalic = require("../atom/text_td_small_cursive")
const textTh = require("../atom/text_th")
const {FontFamily, FontFamilyThin, FontFamilyExtraBold, FontSizeThSecondary, FontSizeTdMicro, FatBorder} = require("../const");

module.exports = function (body, titlesIndexes, titles, priceRounds, unitChangeRounds){
    let rows = [];
    let tableRowCnt = 0
    let titleRowCnt = 0
    body.forEach(m =>{
        let unitChangeRound = 0
        if (unitChangeRounds[tableRowCnt]) unitChangeRound = unitChangeRounds[tableRowCnt]

        const changeUnits = getChange(m.Week2Med.price_feed, 0, m.Week1Med.price_feed[0].value, false, unitChangeRound);
        const changePercents = getChange(m.Week2Med.price_feed, 0, m.Week1Med.price_feed[0].value, true);
        let names = [m.Name, ""]
        if (m.Name.indexOf(";") !== -1) {
            names = m.Name.split(";")
            names[1] = "(" + names[1] + ")"
        }

        if(tableRowCnt === titlesIndexes[titleRowCnt]){
            rows.push(
                new docx.TableRow({
                    children:[
                        new docx.TableCell({
                            children: [textTh(titles[titleRowCnt], FontFamilyExtraBold, FontSizeThSecondary)],
                            columnSpan: 6,
                            borders: {
                                top: FatBorder,
                                bottom: FatBorder
                            }
                        }),
                    ]
                })
            )
            titleRowCnt++
        }
        let priceRound = 0
        if (priceRounds[tableRowCnt]) priceRound = priceRounds[tableRowCnt]
        rows.push(
            new docx.TableRow({
                children:[
                    cellCenter({
                        children: [textTd(`${names[0].trim()} ${names[1].trim()}`, undefined, undefined, FontFamily),
                            textTd(`${m.DeliveryType.trim()} ${m.Market.trim()}`, undefined, undefined, FontFamilyThin, FontSizeTdMicro),
                        ]
                    }),
                    cellCenter({
                        children: [textTd(m.Unit, undefined, undefined, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week1Med.price_feed[0].value, undefined, priceRound, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week2Med.price_feed[0].value, undefined, priceRound, FontFamilyExtraBold)]
                    }),
                    cellCenter({
                        children: [textTd(changeUnits.Text, changeUnits.Color, undefined, FontFamily)]
                    }),
                    cellCenter({
                        children: [textTd(changePercents.Text, changePercents.Color, undefined, FontFamily)]
                    }),
                ]
            })
        )
        tableRowCnt++
    })
    return rows
}