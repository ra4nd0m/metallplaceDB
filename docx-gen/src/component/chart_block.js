const docx = require("docx");
const chart = require("../client/chart");
const paragraph = require("../atom/paragraph")
const paragraphCentred = require("../atom/paragraph_centred")
const text = require("../atom/text")
const {TableCellMarginNil, Green, Red, ColorDefault, FontFamily, FontFamilySemiBold, ApiEndpoint, FontFamilyExtraBold,
    FontFamilyMedium
} = require("../const");
const numFormat = require("../utils/numbers_format")
const axios = require("axios");

module.exports = async function chartBlock(url, isBig, avgGroup, comparePeriod) {
    const image = await chart(url, isBig);
    const infoRow = await getInfo(isBig, url, avgGroup, comparePeriod)

    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
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


async function getInfo(isBig, url, group, comparePeriod) {
    if (isBig) return []
    if (comparePeriod === undefined) comparePeriod = "н/н"
    const nValues = 2 * group

    baseUrl = ApiEndpoint +`/getChart/`
    url = url.substring(baseUrl.length, url.length)
    const urlParams = url.split("_");
    const materialId = urlParams[0]
    const propertyId = urlParams[1]
    const finish = urlParams[3].split("-")
    const date = `${finish[2]}-${finish[0]}-${finish[1]}`
    const materialInfo = await axios.post(ApiEndpoint + `/getMaterialInfo`, {id: Number(materialId)})
    let prices = await axios.post(ApiEndpoint + `/getNLastValues`, {
        material_source_id: Number(materialId),
        property_id: Number(propertyId),
        n_values: nValues,
        finish: date
    })
    let lastGroup = []
    let firstGroup = []
    for (let i = 0; i < group; i++) {
        lastGroup.push(prices.data.price_feed[prices.data.price_feed.length - (i + 1)].value)
        firstGroup.push(prices.data.price_feed[i].value)
    }
    let lastPrice = getAvg(lastGroup)
    let firstPrice = getAvg(firstGroup)
    if (comparePeriod === "м/м") {
        const finish = date
        const start = subtractMonth(date)
        prices = await axios.post(ApiEndpoint + `/getMonthlyAvgFeed`, {
            material_source_id: Number(materialId),
            property_id: Number(propertyId),
            start: start,
            finish: finish
        })
        if (prices.data.price_feed.length < 2) {
            throw new Error('Wrong return of getMonthlyAvgFeed');
        }
        firstPrice = prices.data.price_feed[prices.data.price_feed.length - 2].value
        lastPrice = prices.data.price_feed[prices.data.price_feed.length - 1].value
    }
    let percent = Math.round((lastPrice - firstPrice) / firstPrice * 1000) / 10
    let percentBlock
    if (percent > 0) {
        percentBlock =
                text({
                    text: `+${numFormat(percent)}% ${comparePeriod}`,
                    font: FontFamilyExtraBold,
                    color: Green,
                    size: 12 * 2,
                })
    } else {
        if (percent < 0) {
            percentBlock =
                    text({
                        text: `${numFormat(percent)}% ${comparePeriod}`,
                        font: FontFamilyExtraBold,
                        color: Red,
                        size: 12 * 2,
                    })

        } else {
            percentBlock =
                    text({
                        text: `- ${comparePeriod}`,
                        font: FontFamilyExtraBold,
                        color: ColorDefault,
                        size: 12 * 2,
                    })
        }
    }
    if (lastPrice > 30) {
        lastPrice = Math.round(lastPrice)
    }

    let materialType
    let materialName
    let materialCountry
    try {
         materialType = materialInfo.data.info.Name.match(/\((.*?)\)/)[1].trim();
         materialName = materialInfo.data.info.Name.match(/^(.*?)\s*\(/)[1].trim();
         materialCountry =  materialInfo.data.info.Market.match(/\((.*?)\)/)?.[1].trim();
    } catch (e) {
        throw new Error("error getting infoRow data" + e.message)
    }


    return [new docx.TableRow({
        children: [
            new docx.TableCell({
                margins: TableCellMarginNil,
                verticalAlign: docx.VerticalAlign.CENTER,
                children: [
                    paragraph({
                        alignment: docx.AlignmentType.LEFT,
                        spacing: {before: 0},
                        children: [
                            text({
                                text: materialName,
                                font: FontFamilyExtraBold,
                                color: '#000000',
                                size: 12 * 2,
                            }),
                            text({
                                text: ` (${materialType}, ${materialInfo.data.info.DeliveryType} ${materialCountry})`,
                                font: FontFamilyMedium,
                                color: '#000000',
                                size: 12 * 2,
                            }),
                        ],
                    }),
                    paragraph({
                        alignment: docx.AlignmentType.LEFT,
                        spacing: {before: 0},
                        children: [
                            text({
                                text: numFormat(lastPrice),
                                font: FontFamilyExtraBold,
                                color: '#000000',
                                size: 12 * 2,
                            }),
                            text({
                                text: " " + materialInfo.data.info.Unit + " ",
                                font: FontFamilyMedium,
                                color: '#000000',
                                size: 12 * 2,
                            }),
                            percentBlock,
                        ],
                    }),
                ],
            }),



            // new docx.TableCell({
            //     verticalAlign: docx.VerticalAlign.CENTER,
            //     margins: TableCellMarginNil,
            //     children: [
            //         percent,
            //         paragraph({
            //             alignment: docx.AlignmentType.CENTER,
            //             spacing: {before: 0},
            //             children: [
            //                 text({
            //                     text: comparePeriod,
            //                     font: FontFamily,
            //                     color: '#656667',
            //                     size: 11 * 2,
            //                 })
            //             ],
            //         }),
            //     ],
            // }),
        ],
    })]
}

function getAvg(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function subtractMonth(dateString) {
    var date = new Date(dateString);
    date.setDate(date.getDate() - 31);
    return date.toISOString().split('T')[0];
}
