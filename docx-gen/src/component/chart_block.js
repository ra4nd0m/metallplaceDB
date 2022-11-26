const docx = require("docx");
const chart = require("../client/chart");
const paragraph = require("../atom/paragraph")
const paragraphCentred = require("../atom/paragraph_centred")
const text = require("../atom/text")
const {TableCellMarginNil, Green, Red, ColorDefault} = require("../const");
const numFormat = require("../utils/numbers_format")
const axios = require("axios");

module.exports = async function chartBlock(url, isBig, avgGroup) {
    const image = await chart(url, isBig);
    const infoRow = await getInfo(isBig, url, avgGroup)

    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [4, 2, 2],
        borders: docx.TableBorders.NONE,
        rows: [
            ...infoRow,

            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [image]
                            })
                        ],
                    }),
                ]
            })
        ],
    })
}


async function getInfo(isBig, url, group) {
    if (isBig) return []
    const nValues = 2 * group
    url = url.substring("http://localhost:8080/getChart/".length, url.length)
    const urlParams = url.split("_");
    const materialId = urlParams[0]
    const propertyId = urlParams[1]
    const finish = urlParams[3].split("-")
    const date = `${finish[2]}-${finish[0]}-${finish[1]}`
    const materialInfo = await axios.post("http://localhost:8080/getMaterialInfo", {id: Number(materialId)})
    const prices = await axios.post("http://localhost:8080/getNLastValues", {
        material_source_id: Number(materialId),
        property_id: Number(propertyId),
        n_values: nValues,
        finish: date
    })

    let lastGroup = []
    let firstGroup = []
    for(let i = 0; i < group; i++){
        lastGroup.push(prices.data.price_feed[prices.data.price_feed.length - (i + 1)].value)
        firstGroup.push(prices.data.price_feed[i].value)

    }
    const lastPrice = getAvg(lastGroup)
    const firstPrice = getAvg(firstGroup)
    let percent = Math.round((lastPrice - firstPrice) / firstPrice * 1000) / 10
    percent = percent > 0 ? paragraphCentred(`+${numFormat(percent)}% н/н`, Green) : (percent < 0 ? paragraphCentred(numFormat(percent) + '% н/н', Red) : paragraphCentred('- н/н', ColorDefault))
    return [new docx.TableRow({
        children: [
            new docx.TableCell({
                margins: TableCellMarginNil,
                children: [
                    paragraph({
                        alignment: docx.AlignmentType.LEFT,
                        spacing: {before: 0},
                        children: [
                            text(materialInfo.data.info.Name + " " + materialInfo.data.info.Market)
                        ],
                    }),
                ],
            }),

            new docx.TableCell({
                margins: TableCellMarginNil,
                children: [
                    paragraph({
                        alignment: docx.AlignmentType.RIGHT,
                        spacing: {before: 0},
                        children: [
                            text(numFormat(lastPrice) + " " + materialInfo.data.info.Unit)
                        ],
                    }),
                ],
            }),

            new docx.TableCell({
                margins: TableCellMarginNil,
                children: [
                    percent,
                ],
            }),
        ],
    })]
}
function getAvg(arr){
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}
