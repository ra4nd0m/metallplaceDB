const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId, FontFamilyMedium, FontSizeThMain,
    FontFamilyThin,
    FontSizeThSecondary, FontSizeThExtraInfo, ApiEndpoint, FatBorder, ThinBorder, BorderNil, BordersNil,
    FontFamilyExtraBold
} = require("../const");
const {FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_minimax_body")
const textTh = require("../atom/text_th")
const priceBlock = require("../atom/price_block")
const cellCenter = require("../atom/cell_centred");
const margins = require("../atom/margins");


module.exports = async function singleTableMinimax(materialId, dates, unitChangeRound, percentChangeRound, type, priceRound) {
    const first = new Date(dates[0])
    const last = new Date(dates[1])
    if (type === undefined) type = "day"
    let minBody
    let maxBody
    let medBody

    const from = `${first.getFullYear()}-${FormatDayMonth(first.getMonth() + 1)}-${FormatDayMonth(first.getDate())}`
    const to = `${last.getFullYear()}-${FormatDayMonth(last.getMonth() + 1)}-${FormatDayMonth(last.getDate())}`

    const resMat = await axios.post(ApiEndpoint + `/getMaterialInfo`, {id: materialId})

    if (type === "day"){
        minBody = await axios.post(ApiEndpoint + `/getValueForPeriod`, { material_source_id: materialId, property_id: MinPriceId, start: from, finish: to})
        maxBody = await axios.post(ApiEndpoint + `/getValueForPeriod`, { material_source_id: materialId, property_id: MaxPriceId, start: from, finish: to})
        medBody = await axios.post(ApiEndpoint + `/getValueForPeriod`, { material_source_id: materialId, property_id: MedPriceId, start: from, finish: to})
    }
    if (type === "month"){
        minBody = await axios.post(ApiEndpoint + `/getMonthlyAvgFeed`, { material_source_id: materialId, property_id: MinPriceId, start: from, finish: to})
        maxBody = await axios.post(ApiEndpoint + `/getMonthlyAvgFeed`, { material_source_id: materialId, property_id: MaxPriceId, start: from, finish: to})
        medBody = await axios.post(ApiEndpoint + `/getMonthlyAvgFeed`, { material_source_id: materialId, property_id: MedPriceId, start: from, finish: to})
    }


    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [3,3,1.5,1.5],
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        borders: {top: FatBorder, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        rowSpan: 2,
                        verticalAlign: docx.VerticalAlign.CENTER,
                        children: [textTh("Дата", FontFamilyMedium, FontSizeThMain)]
                    }),
                    new docx.TableCell({
                        borders: {top: FatBorder, right: ThinBorder, bottom: FatBorder, left: BorderNil},
                        alignment: docx.AlignmentType.CENTER,
                        verticalAlign: docx.VerticalAlign.CENTER,
                        columnSpan: 3,
                        margins: TableCellMarginNil,
                        children: [
                            textTh(resMat.data.info.Name, FontFamilyExtraBold, FontSizeThMain),
                            textTh(resMat.data.info.DeliveryType + " " + resMat.data.info.Market, FontFamilyThin, FontSizeThSecondary),
                        ]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        borders: {top: BorderNil, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [priceBlock(resMat.data.info.Unit)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        borders: {top: BorderNil, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        children: [textTh("Изм.", FontFamilyMedium, FontSizeThMain),
                            textTh(resMat.data.info.Unit, FontFamilyThin, FontSizeThExtraInfo)
                        ],
                        verticalAlign: docx.VerticalAlign.CENTER,
                    }),
                    new docx.TableCell({
                        borders: {top: BorderNil, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        children: [textTh("Изм.", FontFamilyMedium, FontSizeThMain),
                            textTh("%", FontFamilyThin, FontSizeThExtraInfo)
                        ],
                        verticalAlign: docx.VerticalAlign.CENTER,
                    }),
                ]
            }),
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [3, 1, 1, 1, 1.5, 1.5],
        rows: tableBody(minBody.data, maxBody.data, medBody.data, unitChangeRound, percentChangeRound, type, priceRound),
    })

    return margins([paragraph({children: [header, body]})])
}