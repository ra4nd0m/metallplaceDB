const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")
const getChange = require("../utils/get_change")

function insertMed(i, feed1, feed2){
    let cells = []
    let sum1 = 0
    let sum2 = 0
    if(i % 5 === 0){
        for(let p = i; p < i + 5; p++){
            sum1 += feed1[p].value
            sum2 += feed2[p].value
        }
        cells.push(
            new docx.TableCell({
                rowSpan: 5,
                children: [paragraphCentred(Math.round(sum1 / 5 * 100) / 100)]
            }),
        )
        cells.push(
            new docx.TableCell({
                rowSpan: 5,
                children: [paragraphCentred(Math.round(sum2 / 5 * 100) / 100)]
            })
        )
        return cells
    }
    return []
}

module.exports = function (feed1, feed2) {
    let rows = [];
    const pf1 = feed1.price_feed
    const pf2 = feed2.price_feed
    for (let i = 0; i < pf1.length; i++) {
        rows.push(
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [paragraphCentred(pf1[i].date.substring(0, 10))]
                    }),

                    new docx.TableCell({
                        children: [paragraphCentred(pf1[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pf1, i, feed1.prev_price, false))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pf1, i, feed1.prev_price, true))]
                    }),

                    new docx.TableCell({
                        children: [paragraphCentred(pf2[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pf2, i, feed1.prev_price, false))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pf2, i, feed1.prev_price, true))]
                    }),

                    ...insertMed(i, pf1, pf2),
                ]
            })
        )
    }

    return rows
}