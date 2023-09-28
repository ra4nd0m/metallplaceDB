const docx = require("docx");
const axios = require("axios");
const {FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_body")
const textTh = require("../atom/text_th")
const {
    FontFamilyMedium,
    FontSizeThMain,
    FontFamilyThin,
    FontSizeThSecondary,
    FontSizeThExtraInfo,
    MonthPredictId, FontSizeTd, ApiEndpoint, FatBorder, ThinBorder, BorderNil, FontFamily, FontFamilyExtraBold
} = require("../const");
const cellCenter = require("../atom/cell_centred");
const paragraph = require("../atom/paragraph");
const {formatDateTable} = require("../utils/date_format");
const margins = require("../atom/margins");

module.exports = async function singleTable(materialId, propertyId, dates, unitChangeRound, percentChangeRound, scale, predict, priceRound) {
    const first = new Date(dates[0])
    const last = new Date(dates[1])
    let resBody
    if (scale === undefined) scale = "day"

    const from = `${first.getFullYear()}-${FormatDayMonth(first.getMonth() + 1)}-${FormatDayMonth(first.getDate())}`
    const to = `${last.getFullYear()}-${FormatDayMonth(last.getMonth() + 1)}-${FormatDayMonth(last.getDate())}`

    const resMat = await axios.post(ApiEndpoint + `/getMaterialInfo`, {id: materialId})
    if (scale === "month") {
        resBody = await axios.post(ApiEndpoint + `/getMonthlyAvgFeed`, {
            material_source_id: materialId,
            property_id: propertyId,
            start: from,
            finish: to
        })

    }
    if (scale === "day") {
        resBody = await axios.post(ApiEndpoint + `/getValueForPeriod`, {
            material_source_id: materialId,
            property_id: propertyId,
            start: from,
            finish: to
        })
    }

    let tableComponents = []

    tableComponents.push(new docx.Table({
            width: {
                size: 100,
                type: docx.WidthType.PERCENTAGE,
            },
            rows: [
                new docx.TableRow({
                    children: [
                        new docx.TableCell({
                            rowSpan: 2,
                            verticalAlign: docx.VerticalAlign.CENTER,
                            children: [textTh("Дата", FontFamilyMedium, FontSizeThMain)],
                            borders: {
                                top: FatBorder,
                                bottom: FatBorder,
                                left: ThinBorder,
                                right: ThinBorder
                            }
                        }),
                        new docx.TableCell({
                            columnSpan: 3,
                            children: [
                                textTh(resMat.data.info.Name, FontFamilyExtraBold, FontSizeThMain),
                                textTh(resMat.data.info.DeliveryType + " " + resMat.data.info.Market, FontFamilyThin, FontSizeThSecondary),
                            ],
                            borders: {
                                top: FatBorder,
                                bottom: FatBorder,
                                left: ThinBorder,
                                right: ThinBorder,

                            }
                        })
                    ]
                }),
                new docx.TableRow({

                    children: [
                        new docx.TableCell({
                            children: [
                                textTh("Цена", FontFamily, FontSizeThMain),
                                textTh(resMat.data.info.Unit, FontFamilyThin, FontSizeThExtraInfo)
                            ],
                            borders: {
                                top: BorderNil,
                                bottom: FatBorder,
                                left: ThinBorder,
                                right: ThinBorder
                            }
                        }),
                        new docx.TableCell({

                            children: [
                                textTh("Изм.", FontFamily, FontSizeThMain),
                                textTh(resMat.data.info.Unit, FontFamilyThin, FontSizeThExtraInfo)],
                            verticalAlign: docx.VerticalAlign.CENTER,
                            borders: {
                                top: BorderNil,
                                bottom: FatBorder,
                                left: ThinBorder,
                                right: ThinBorder
                            }
                        }),
                        new docx.TableCell({
                            children: [
                                textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary),
                                textTh("%", FontFamilyThin, FontSizeThExtraInfo)],
                            verticalAlign: docx.VerticalAlign.CENTER,
                            borders: {
                                top: BorderNil,
                                bottom: FatBorder,
                                left: ThinBorder,
                                right: ThinBorder
                            }
                        }),
                    ]
                }),
                ...tableBody(resBody.data, unitChangeRound, percentChangeRound, scale, priceRound),
            ]
        })
    )

    if(predict && scale === "month") {
        let lastPrice = resBody.data.price_feed[resBody.data.price_feed.length - 1]
        let predictFrom = new Date(to)
        let predictTo = new Date(predictFrom)
        predictFrom.setMonth(predictFrom.getMonth())
        predictTo.setMonth(predictTo.getMonth() + 3)

        let predictBody = await axios.post(ApiEndpoint + `/getValueForPeriod`, {
            material_source_id: materialId,
            property_id: MonthPredictId,
            start: predictFrom,
            finish: predictTo
        })
        let predictFeed = predictBody.data.price_feed

        let lastPricePredict = predictFeed.shift()
        let predictAccuracy = `Точность прогноза за ${formatDateTable(lastPrice.date, "monthFull")} - ${Math.round(100 - (Math.abs(lastPrice.value - lastPricePredict.value)) / lastPrice.value * 100)} %`


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
                rows: tableBody(predictBody.data, unitChangeRound, percentChangeRound, scale)
            })
        )

        // Predict accuracy
        tableComponents.push(
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [1, 1],
                rows: [
                    new docx.TableRow({
                        children: [
                            cellCenter({
                                children: [textTh(predictAccuracy, FontFamilyThin, FontSizeTd)]
                            }),
                        ]
                    })
                ]
            })
        )

    }

    return margins([paragraph({children: tableComponents})])
}