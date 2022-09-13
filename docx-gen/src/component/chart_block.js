const docx = require("docx");
const {TextRun} = require("docx");
const chart = require("../client/chart");
const paragraph = require("../atom/paragraph")
const text = require("../atom/text")
const {TableCellMarginNil} = require("../const");
const axios = require("axios");

module.exports = async function chartBlock(url, isBig) {
    const image = await chart(url, isBig);
    const infoRow = await getInfo(isBig, url)

    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [3, 1],
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


async function getInfo(isBig, url){
    if(!isBig){

        url = url.substring("http://localhost:8080/getChart/".length, url.length)
        const urlParams = url.split("_");
        const materialId = urlParams[0]
        const propertyId = urlParams[1]
        const finish = urlParams[3].split("-")
        const date = `${finish[2]}-${finish[0]}-${finish[1]}`
        const prices = await axios.post("http://localhost:8080/getNLastValues", {
            material_source_id: Number(materialId),
            property_id: Number(propertyId),
            n_values: 2,
            finish: date
        })

        const lastPrice = prices.data.price_feed[1].value
        let percent = Math.round((prices.data.price_feed[1].value - prices.data.price_feed[0].value) / prices.data.price_feed[0].value * 1000) / 10
        if (percent > 0){
            percent = `+${percent}`
        }
        return [new docx.TableRow({
            children: [
                new docx.TableCell({
                    margins: TableCellMarginNil,
                    children: [
                        paragraph({
                            alignment: docx.AlignmentType.RIGHT,
                            spacing: {before: 0},
                            children: [
                                text(lastPrice)
                            ],
                        }),
                    ],
                }),

                new docx.TableCell({
                    margins: TableCellMarginNil,
                    children: [
                        paragraph({
                            alignment: docx.AlignmentType.CENTER,
                            children: [text(percent)],
                        }),
                    ],
                }),

            ],
        })]
    }
    return []
}