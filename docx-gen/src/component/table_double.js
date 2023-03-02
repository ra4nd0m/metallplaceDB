const docx = require("docx");
const paragraph = require("../atom/paragraph");
const {TableCellMarginNil, TableNoOuterBorders, FontFamilyMedium, FontSizeThMain, FontFamilyThin, FontSizeThExtraInfo,
    FontSizeThSecondary, MonthPredictId, FontSizeTd
} = require("../const");
const axios = require("axios");
const tableBody = require("../atom/table_double_body");
const {formatDateDb, formatDateTable} = require("../utils/date_format");
const cellCenter = require("../atom/cell_centred")
const textTh = require("../atom/text_th")

const {TableRow} = docx;

function headerMaterial(name, market, delivery, unit) {
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        rows: [
            new TableRow({
                children: [cellCenter({columnSpan: 3, children: [
                        textTh(name, FontFamilyMedium, FontSizeThMain),
                        textTh(delivery + " " + market, FontFamilyThin, FontSizeThSecondary),
                    ]})]
            }),
            new TableRow({
                children: [
                    new docx.TableCell({
                        children: [
                            textTh("Цена", FontFamilyMedium, FontSizeThMain),
                            textTh(unit, FontFamilyThin, FontSizeThExtraInfo)
                        ]
                    }),
                    cellCenter({children: [textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary), textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]}),
                    cellCenter({children: [textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary), textTh("%", FontFamilyThin, FontSizeThExtraInfo)]}),
                ],
            })
        ]
    })
}

module.exports = async function tableDouble(materialId1, materialId2, propertyId, dates, unitChangeRound, percentChangeRound, scale, predict, priceRound) {
    const from = formatDateDb(dates[0])
    const to = formatDateDb(dates[1])
    let resBody1
    let resBody2
    if (scale === undefined) scale = "day"

    const resMat1 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getMaterialInfo`, {id: materialId1})
    const resMat2 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getMaterialInfo`, {id: materialId2})
    if(scale === "day"){
        resBody1 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getValueForPeriod`, {
            material_source_id: materialId1,
            property_id: propertyId,
            start: from,
            finish: to
        })
        resBody2 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getValueForPeriod`, {
            material_source_id: materialId2,
            property_id: propertyId,
            start: from,
            finish: to
        })
    }
    if(scale === "month"){
        resBody1 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getMonthlyAvgFeed`, {
            material_source_id: materialId1,
            property_id: propertyId,
            start: from,
            finish: to
        })
        resBody2 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getMonthlyAvgFeed`, {
            material_source_id: materialId2,
            property_id: propertyId,
            start: from,
            finish: to
        })
    }

    let nameRaw1 = resMat1.data.info.Name.split(", ")
    let nameRaw2 = resMat2.data.info.Name.split(", ")
    let name11 = nameRaw1.shift()
    let name12 = nameRaw1.join(" ")
    let name21 = nameRaw2.shift()
    let name22 = nameRaw2.join(" ")


    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1, 2, 2],
        rows: [
            new TableRow({
                children: [
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Дата", FontFamilyMedium, FontSizeThMain)]}),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(`${name11} (${name12})`, resMat1.data.info.Market, resMat1.data.info.DeliveryType, resMat1.data.info.Unit)]
                    }),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(`${name21} (${name22})`, resMat2.data.info.Market, resMat2.data.info.DeliveryType, resMat2.data.info.Unit)]
                    }),
                ],
            }),
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [3, 2, 2, 2, 2, 2, 2],
        rows: tableBody(resBody1.data, resBody2.data, unitChangeRound, percentChangeRound, scale, priceRound),
    })
    let tableComponents = [header, body]

    if(predict && scale === "month") {
        let lastPrice1 = resBody1.data.price_feed[resBody1.data.price_feed.length - 1]
        let lastPrice2 = resBody2.data.price_feed[resBody2.data.price_feed.length - 1]
        let predictFrom = new Date(to)
        let predictTo = new Date(predictFrom)
        predictFrom.setMonth(predictFrom.getMonth())
        predictTo.setMonth(predictTo.getMonth() + 3)

        let predictBody1 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getValueForPeriod`, {
            material_source_id: materialId1,
            property_id: MonthPredictId,
            start: predictFrom,
            finish: predictTo
        })
        let predictFeed1 = predictBody1.data.price_feed
        let predictBody2 = await axios.post(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getValueForPeriod`, {
            material_source_id: materialId2,
            property_id: MonthPredictId,
            start: predictFrom,
            finish: predictTo
        })
        let predictFeed2 = predictBody2.data.price_feed

        let lastPrice1Predict = predictFeed1.shift()
        let lastPrice2Predict = predictFeed2.shift()
        let predictAccuracy1 = `Точность прогноза за ${formatDateTable(lastPrice1.date, "monthFull")} - ${Math.round(100 - (Math.abs(lastPrice1.value - lastPrice1Predict.value)) / lastPrice1.value * 100)} %`
        let predictAccuracy2 = `Точность прогноза за ${formatDateTable(lastPrice1.date, "monthFull")} - ${Math.round(100 - (Math.abs(lastPrice2.value - lastPrice2Predict.value)) / lastPrice2.value * 100)} %`

        // "Прогноз"
        tableComponents.push(
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [1],
                rows: [
                    new docx.TableRow({
                        children: [
                            cellCenter({
                                children: [textTh("Прогноз", FontFamilyMedium, FontSizeThSecondary)]
                            })
                        ]
                    })
                ]
            })
        )

        // Predict feed
        tableComponents.push(
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [3, 2, 2, 2, 2, 2, 2],
                rows: tableBody(predictBody1.data, predictBody2.data, unitChangeRound, percentChangeRound, scale, priceRound)
            })
        )

        // Predict accuracy
        tableComponents.push(
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [9, 6],
                rows: [
                    new docx.TableRow({
                        children: [
                            cellCenter({
                                children: [textTh(predictAccuracy1, FontFamilyThin, FontSizeTd)]
                            }),
                            cellCenter({
                                children: [textTh(predictAccuracy2, FontFamilyThin, FontSizeTd)]
                            }),
                        ]
                    })
                ]
            })
        )

    }
    return paragraph({children: tableComponents})
}