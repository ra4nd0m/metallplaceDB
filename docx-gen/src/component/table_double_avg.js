const docx = require("docx");
const paragraph = require("../atom/paragraph");
const {TableCellMarginNil, TableNoOuterBorders, FontFamilyMedium, FontSizeThMain, FontFamily, FontFamilySemiBold,
    FontSizeThSecondary, FontSizeThExtraInfo, FontFamilyThin, ApiEndpoint
} = require("../const");
const axios = require("axios");
const cellCenter = require("../atom/cell_centred")
const textTh = require("../atom/text_th")

const tableBody = require("../atom/table_double_avg_body");
const {formatDateDb, formatDateTable} = require("../utils/date_format");

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
                        textTh( delivery + " " + market, FontFamilyThin, FontSizeThSecondary)]})
                ]
            }),
            new TableRow({
                children: [
                    cellCenter({children: [textTh(`Цена`, FontFamilyMedium, FontSizeThSecondary), textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]}),
                    cellCenter({children: [textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary), textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]}),
                    cellCenter({children: [textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary), textTh("%", FontFamilyThin, FontSizeThExtraInfo)]}),
                ],
            })
        ]
    })
}

function avgBlock(name1, name2, unit) {
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        rows: [
            new TableRow({
                children: [
                    cellCenter({children: [textTh(name1, FontFamilyMedium, FontSizeThSecondary)]}),
                    cellCenter({children: [textTh(name2, FontFamilyMedium, FontSizeThSecondary)]}),
                ]
            }),
            new TableRow({
                children: [
                    cellCenter({children: [textTh(`Средняя за неделю`, FontFamilyMedium, FontSizeThSecondary),
                            textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]})
                ],
            })
        ]
    })
}

module.exports = async function tableDoubleWithWeekAvg(materialId1, materialId2, propertyId, dates, unitChangeRound, percentChangeRound, avgRound) {
    const from = formatDateDb(dates[0])
    const to = formatDateDb(dates[1])

    const resMat1 = await axios.post(ApiEndpoint + `/getMaterialInfo`, {id: materialId1})
    const resMat2 = await axios.post(ApiEndpoint + `/getMaterialInfo`, {id: materialId2})
    const resBody1 = await axios.post(ApiEndpoint + `/getValueForPeriod`, {
        material_source_id: materialId1,
        property_id: propertyId,
        start: from,
        finish: to
    })
    const resBody2 = await axios.post(ApiEndpoint + `/getValueForPeriod`, {
        material_source_id: materialId2,
        property_id: propertyId,
        start: from,
        finish: to
    })

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1, 2, 2, 2],
        rows: [
            new TableRow({
                children: [
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Дата", FontFamilyMedium, FontSizeThMain)]}),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Market,
                            resMat1.data.info.DeliveryType, resMat1.data.info.Unit)]
                    }),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat2.data.info.Name, resMat2.data.info.Market,
                            resMat2.data.info.DeliveryType, resMat2.data.info.Unit)]
                    }),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [ avgBlock(`${name11} (${name12})`, `${name21} (${name22})`, resMat1.data.info.Unit)]
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
        columnWidths: [3, 2, 2, 2, 2, 2, 2, 3, 3],
        rows: tableBody(resBody1.data, resBody2.data, unitChangeRound, percentChangeRound, avgRound),
    })

    return paragraph({children: [header, body]})
}