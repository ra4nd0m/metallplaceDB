const docx = require("docx");
const paragraph = require("../atom/paragraph");
const paragraphCentred = require("../atom/paragraph_centred");
const {TableCellMarginNil, TableNoOuterBorders} = require("../const");
const axios = require("axios");
const tableBody = require("../atom/table_double_body");
const {formatDateDb} = require("../utils/date");
const cellCenter = require("../atom/cell_centred")
const textTh = require("../atom/text_th")

const {TableRow, TableCell} = docx;

function headerMaterial(name, unit) {
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        rows: [
            new TableRow({
                children: [cellCenter({columnSpan: 3, children: [textTh(name)]})]
            }),
            new TableRow({
                children: [
                    cellCenter({children: [textTh("Цена")]}),
                    cellCenter({children: [textTh(`Изм. ${unit}`)]}),
                    cellCenter({children: [textTh("Изм. %")]}),
                ],
            })
        ]
    })
}

module.exports = async function tableDoubleWithWeekAvg(materialId1, materialId2, propertyId, dates) {
    const from = formatDateDb(dates[0])
    const to = formatDateDb(dates[1])

    const resMat1 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId1})
    const resMat2 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId2})
    const resBody1 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId1,
        property_id: propertyId,
        start: from,
        finish: to
    })
    const resBody2 = await axios.post("http://localhost:8080/getValueForPeriod", {
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
        columnWidths: [1, 2, 2],
        rows: [
            new TableRow({
                children: [
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Дата")]}),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Unit)]
                    }),
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat2.data.info.Name, resMat2.data.info.Unit)]
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
        rows: tableBody(resBody1.data, resBody2.data),
    })

    return paragraph({children: [header, body]})
}