const getChange = require("../utils/get_change");
const docx = require("docx");
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")

module.exports = function (body, titlesIndexes, titles){
    let rows = [];
    let tableRowCnt = 0
    let idxCnt = 0
    body.forEach(m =>{
        const changeUnits = getChange(m.Week2Med.price_feed, 0, m.Week1Med.price_feed[0].value, false);
        const changePercents = getChange(m.Week2Med.price_feed, 0, m.Week1Med.price_feed[0].value, true);

        if(tableRowCnt === titlesIndexes[idxCnt]){
            rows.push(
                new docx.TableRow({
                    children:[
                        cellCenter({
                            children: [textTd(titles[idxCnt])],
                            columnSpan: 6
                        }),
                    ]
                })
            )
            idxCnt++
        }

        rows.push(

            new docx.TableRow({
                children:[
                    cellCenter({
                        children: [textTd(m.Name), textTd(m.DeliveryType)]
                    }),
                    cellCenter({
                        children: [textTd(m.Unit)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week1Med.price_feed[0].value)]
                    }),
                    cellCenter({
                        children: [textTd(m.Week2Med.price_feed[0].value)]
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
        tableRowCnt++
    })
    return rows
}