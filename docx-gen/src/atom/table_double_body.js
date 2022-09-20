const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")
const getChange = require("../utils/get_change")


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
                    new docx.TableCell({
                        children: [paragraphCentred(pf1[i].date.substring(0, 10))]
                    }),

                    new docx.TableCell({
                        children: [paragraphCentred(pf1[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changeUnits1.Text, changeUnits1.Color)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changePercents1.Text, changePercents1.Color)]
                    }),

                    new docx.TableCell({
                        children: [paragraphCentred(pf2[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changeUnits2.Text, changeUnits1.Color)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changePercents2.Text, changePercents1.Color)]
                    }),

                ]
            })
        )
    }

    return rows
}