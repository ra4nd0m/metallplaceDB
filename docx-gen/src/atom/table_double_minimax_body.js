const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")
const getChange = require("../utils/get_change")

module.exports = function (min1, max1, med1, min2, max2, med2) {
    let rows = [];
    const pfMin1 = min1.price_feed
    const pfMax1 = max1.price_feed
    const pfMed1 = med1.price_feed

    const pfMin2 = min2.price_feed
    const pfMax2 = max2.price_feed
    const pfMed2 = med2.price_feed

    for (let i = 0; i < pfMed1.length; i++) {
        const changeUnits1 = getChange(pfMed1, i, med1.prev_price, false);
        const changePercents1 = getChange(pfMed1, i, med1.prev_price, true);

        const changeUnits2 = getChange(pfMed2, i, med2.prev_price, false);
        const changePercents2 = getChange(pfMed2, i, med2.prev_price, true);
        rows.push(
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [paragraphCentred(pfMed1[i].date.substring(0, 10))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMin1[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMax1[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMed1[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changeUnits1.Text, changeUnits1.Color)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changePercents1.Text, changePercents1.Color)]
                    }),


                    new docx.TableCell({
                        children: [paragraphCentred(pfMin2[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMax2[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pfMed2[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changeUnits2.Text, changeUnits2.Color)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changePercents2.Text, changePercents2.Color)]
                    }),
                ]
            })
        )
    }

    return rows
}