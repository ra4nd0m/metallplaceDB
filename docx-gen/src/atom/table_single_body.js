const docx = require("docx");
const paragraphCentred = require("../atom/paragraph_centred")
const getChange = require("../utils/get_change")

module.exports = function (input) {
    let rows = [];
    const pf = input.price_feed
    for (let i = 0; i < pf.length; i++) {
        const changeUnits = getChange(pf, i, input.prev_price, false);
        const changePercents = getChange(pf, i, input.prev_price, true);
        rows.push(
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [paragraphCentred(pf[i].date.substring(0, 10))]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(pf[i].value)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changeUnits.Text, changeUnits.Color)]
                    }),
                    new docx.TableCell({
                        children: [paragraphCentred(changePercents.Text, changePercents.Color)]
                    }),
                ]
            })
        )
    }

    return rows
}

