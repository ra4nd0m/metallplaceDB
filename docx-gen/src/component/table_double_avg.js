const docx = require("docx");
const paragraph = require("../atom/paragraph");
const paragraphCentred = require("../atom/paragraph_centred");
const text = require("../atom/text");
const {TableCellMarginNil, TableNoOuterBorders} = require("../const");
const axios = require("axios");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_double_avg_body");

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

module.exports = async function tableDoubleWithWeekAvg(materialId1, materialId2, propertyId) {
    const dates = GetWeekDates()
    const from = `${dates.first.year}-${FormatDayMonth(dates.first.month)}-${FormatDayMonth(dates.first.day)}`
    const to = `${dates.last.year}-${FormatDayMonth(dates.last.month)}-${FormatDayMonth(dates.last.day)}`

    const resMat1 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId1})
    const resMat2 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId2})
    const resBody1 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId1,
        property_id: propertyId,
        start: '2022-05-03',
        finish: '2022-05-09'
    })
    const resBody2 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId2,
        property_id: propertyId,
        start: '2022-05-03',
        finish: '2022-05-09'
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
                    new TableCell({margins: TableCellMarginNil, children: [paragraphCentred("Дата")]}),
                    new TableCell({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Unit)]
                    }),
                    new TableCell({
                        margins: TableCellMarginNil,
                        children: [headerMaterial(resMat2.data.info.Name, resMat2.data.info.Unit)]
                    }),
                    new TableCell({
                        margins: TableCellMarginNil,
                        children: [paragraphCentred(`Средняя ${resMat1.data.info.Unit}`)]
                    }),
                ],
            }),


            // new TableRow({
            //     children: [
            //         new TableCell({children: [new Paragraph("0,0")], rowSpan: 2}),
            //         new TableCell({children: [new Paragraph("0,1")], columnSpan: 3}),
            //         new TableCell({children: [new Paragraph("0,4")], columnSpan: 3}),
            //         new TableCell({children: [new Paragraph("0,7")], rowSpan: 2}),
            //     ],
            // }),
            // new TableRow({
            //     children: [
            //         new TableCell({children: [new Paragraph("1,1")]}),
            //         new TableCell({children: [new Paragraph("1,2")]}),
            //         new TableCell({children: [new Paragraph("1,3")]}),
            //         new TableCell({children: [new Paragraph("1,4")]}),
            //         new TableCell({children: [new Paragraph("1,5")]}),
            //         new TableCell({children: [new Paragraph("1,6")]}),
            //     ],
            // }),

        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [3, 2, 2, 2, 2, 2, 2, 3, 3],
        rows: tableBody(resBody1.data, resBody2.data),
    })

    return paragraph({children: [header, body]})
}