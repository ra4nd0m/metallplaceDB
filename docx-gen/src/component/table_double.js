const docx = require("docx");
const paragraph = require("../atom/paragraph");
const paragraphCentred = require("../atom/paragraph_centred");
const text = require("../atom/text");
const {TableCellMarginNil, TableNoOuterBorders} = require("../const");
const axios = require("axios");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_double_body");
const {formatDateDb} = require("../utils/date");

const {TableRow, TableCell, Paragraph} = docx;

function headerMaterial(name, unit) {
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        rows: [
            new TableRow({
                children: [new TableCell({columnSpan: 3, children: [paragraphCentred(name)]})]
            }),
            new TableRow({
                children: [
                    new TableCell({children: [paragraphCentred("Цена")]}),
                    new TableCell({children: [paragraphCentred(`Изм. ${unit}`)]}),
                    new TableCell({children: [paragraphCentred("Изм. %")]}),
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
                    new TableCell({margins: TableCellMarginNil, children: [paragraphCentred("Дата")]}),
                    new TableCell({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Unit)]
                    }),
                    new TableCell({
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