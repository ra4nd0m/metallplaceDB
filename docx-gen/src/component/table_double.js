const docx = require("docx");
const paragraph = require("../atom/paragraph");
const paragraphCentred = require("../atom/paragraph_centred");
const {TableCellMarginNil, TableNoOuterBorders, FontFamilyMedium, FontSizeThMain, FontFamilyThin, FontSizeThExtraInfo,
    FontSizeThSecondary
} = require("../const");
const axios = require("axios");
const tableBody = require("../atom/table_double_body");
const {formatDateDb} = require("../utils/date_format");
const cellCenter = require("../atom/cell_centred")
const textTh = require("../atom/text_th")

const {TableRow, TableCell} = docx;

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

module.exports = async function tableDouble(materialId1, materialId2, propertyId, dates, unitChangeRound, percentChangeRound, scale) {
    const from = formatDateDb(dates[0])
    const to = formatDateDb(dates[1])
    let resBody1
    let resBody2
    if (scale === undefined) scale = "day"

    const resMat1 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId1})
    const resMat2 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId2})
    if(scale === "day"){
        resBody1 = await axios.post("http://localhost:8080/getValueForPeriod", {
            material_source_id: materialId1,
            property_id: propertyId,
            start: from,
            finish: to
        })
        resBody2 = await axios.post("http://localhost:8080/getValueForPeriod", {
            material_source_id: materialId2,
            property_id: propertyId,
            start: from,
            finish: to
        })
    }
    if(scale === "month"){
        resBody1 = await axios.post("http://localhost:8080/getMonthlyAvgFeed", {
            material_source_id: materialId1,
            property_id: propertyId,
            start: from,
            finish: to
        })
        resBody2 = await axios.post("http://localhost:8080/getMonthlyAvgFeed", {
            material_source_id: materialId2,
            property_id: propertyId,
            start: from,
            finish: to
        })
    }

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
                        children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Market, resMat1.data.info.DeliveryType, resMat1.data.info.Unit)]
                    }),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat2.data.info.Name, resMat2.data.info.Market, resMat2.data.info.DeliveryType, resMat2.data.info.Unit)]
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
        rows: tableBody(resBody1.data, resBody2.data, unitChangeRound, percentChangeRound, scale),
    })

    return paragraph({children: [header, body]})
}