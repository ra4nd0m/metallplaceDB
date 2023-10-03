const docx = require("docx");
const paragraph = require("../atom/paragraph");
const {TableCellMarginNil, TableNoOuterBorders, FontFamilyMedium, FontSizeThMain, FontFamily, FontFamilySemiBold,
    FontSizeThSecondary, FontSizeThExtraInfo, FontFamilyThin, ApiEndpoint, BordersNil, ThinBorder, BorderNil, FatBorder,
    FontFamilyExtraBold
} = require("../const");
const axios = require("axios");
const cellCenter = require("../atom/cell_centred")
const textTh = require("../atom/text_th")

const tableBody = require("../atom/table_double_avg_body");
const {formatDateDb, formatDateTable} = require("../utils/date_format");
const margins = require("../atom/margins");
const {tr} = require("date-fns/locale");

const {TableRow} = docx;

function headerMaterial(name, market, delivery, unit) {
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: BordersNil,
        rows: [
            new TableRow({
                children: [
                    cellCenter({
                            borders: {top: BorderNil, right: BorderNil, bottom: FatBorder, left: BorderNil},
                            columnSpan: 3, children: [
                    textTh(name, FontFamilyExtraBold, FontSizeThMain),
                        textTh( delivery + " " + market, FontFamilyThin, FontSizeThSecondary)]
                    },
                    true
                    )
                ]
            }),
            new TableRow({
                children: [
                    cellCenter({borders: {top: BorderNil, right: ThinBorder, bottom: BorderNil, left: BorderNil}, children: [textTh(`Цена`, FontFamilyMedium, FontSizeThSecondary), textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]}, true),
                    cellCenter({borders: {top: BorderNil, right: ThinBorder, bottom: BorderNil, left: BorderNil}, children: [textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary), textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]}, true),
                    cellCenter({borders: {top: BorderNil, right: BorderNil, bottom: BorderNil, left: BorderNil}, children: [textTh(`Изм.`, FontFamilyMedium, FontSizeThSecondary), textTh("%", FontFamilyThin, FontSizeThExtraInfo)]}, true),
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

        borders: BordersNil,
        rows: [
            new TableRow({
                height: {
                    value: 9.27 * 20 * 4,
                    rule: docx.HeightRule.EXACT
                },
                children: [
                    cellCenter({borders: {top: BorderNil, right: ThinBorder, bottom: BorderNil, left: BorderNil}, children: [textTh(name1, FontFamilyMedium, FontSizeThSecondary * 0.725)]}, true),
                    cellCenter({borders: {top: BorderNil, right: BorderNil, bottom: BorderNil, left: BorderNil}, children: [textTh(name2, FontFamilyMedium, FontSizeThSecondary * 0.725)]}, true),
                ]
            }),
            new TableRow({
                children: [
                    cellCenter({
                            borders: {top: FatBorder, right: BorderNil, bottom: BorderNil, left: BorderNil},
                            children: [textTh(`Средняя за неделю`, FontFamilyMedium, FontSizeThSecondary),
                            textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]},
                        true
                    )
                ],
            })
        ]
    })
}

module.exports = async function tableDoubleWithWeekAvg(materialId1, materialId2, propertyId, dates, unitChangeRound, percentChangeRound, avgRound, scale) {
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
                    cellCenter({borders: {top: FatBorder, right: ThinBorder, bottom: FatBorder, left: ThinBorder}, margins: TableCellMarginNil, verticalAlign: docx.VerticalAlign.CENTER, children: [textTh("Дата", FontFamilyMedium, FontSizeThMain)]}, true),
                    cellCenter({
                        borders: {top: FatBorder, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Market,
                            resMat1.data.info.DeliveryType, resMat1.data.info.Unit)]
                    }, true),
                    cellCenter({
                        borders: {top: FatBorder, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat2.data.info.Name, resMat2.data.info.Market,
                            resMat2.data.info.DeliveryType, resMat2.data.info.Unit)]
                    }, true),
                    cellCenter({
                        borders: {top: FatBorder, right: ThinBorder, bottom: FatBorder, left: ThinBorder},
                        margins: TableCellMarginNil,
                        children: [ avgBlock(resMat1.data.info.Name, resMat2.data.info.Name, resMat1.data.info.Unit)]
                    }, true),
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
        rows: tableBody(resBody1.data, resBody2.data, unitChangeRound, percentChangeRound, avgRound, scale),
    })

    return margins([paragraph({children: [header, body]})])
}