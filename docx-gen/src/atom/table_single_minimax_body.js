const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")
const getChange = require("../utils/get_change")

module.exports = function (min, max, med) {
    let rows = [];
    const pfMin = min.price_feed
    const pfMax = max.price_feed
    const pfMed = med.price_feed
    for (let i = 0; i < pfMed.length; i++) {
        rows.push(
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [paragraphCentred(pfMed[i].date.substring(0, 10))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMin[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMax[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMed[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pfMed, i, med.prev_price, false))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(getChange(pfMed, i, med.prev_price, true))]
                    }),
                ]
            })
        )
    }

    return rows
}