const getChange = require("../utils/get_change");
const docx = require("docx");
const cellCenter = require("../atom/cell_centred")
const textTd = require("../atom/text_td")

module.exports = function (body){
    let rows = [];
    body.forEach(m =>{
        const changeUnits = getChange(m.Week2Med.price_feed, 0, m.Week2Med.prev_price, false);
        const changePercents = getChange(m.Week2Med.price_feed, 0, m.Week2Med.prev_price, true);
        const material = m.Name.split(", ")

        rows.push(
            new docx.TableRow({
                children:[
                    cellCenter({
                        children: [textTd(material[0]), textTd(material[1])]
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
    })
    return rows
}