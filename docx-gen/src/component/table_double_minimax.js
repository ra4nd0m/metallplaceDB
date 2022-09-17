const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const paragraphCentred = require("../atom/paragraph_centred");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_double_minimax_body")

function priceBlock(unit) {
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,

        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({columnSpan: 3, children: [paragraphCentred(`Цена, ${unit}`)]})
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({margins: TableCellMarginNil,children: [paragraphCentred(`мин`)]}),
                    new docx.TableCell({margins: TableCellMarginNil,children: [paragraphCentred(`макс`)]}),
                    new docx.TableCell({margins: TableCellMarginNil,children: [paragraphCentred(`сред`)]}),
                ]
            })
        ]
    })
}

module.exports = async function doubleTableMinimax(materialId1, materialId2) {
    const dates = GetWeekDates()
    const from = `${dates.first.year}-${FormatDayMonth(dates.first.month)}-${FormatDayMonth(dates.first.day)}`
    const to = `${dates.last.year}-${FormatDayMonth(dates.last.month)}-${FormatDayMonth(dates.last.day)}`

    const resMat1 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId1})
    const minBody1 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId1, property_id: MinPriceId, start: '2022-01-03', finish: '2022-02-09'})
    const maxBody1 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId1, property_id: MaxPriceId, start: '2022-01-03', finish: '2022-02-09'})
    const medBody1 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId1, property_id: MedPriceId, start: '2022-01-03', finish: '2022-02-09'})

    const resMat2= await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId2})
    const minBody2 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId2, property_id: MinPriceId, start: '2022-01-03', finish: '2022-02-09'})
    const maxBody2 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId2, property_id: MaxPriceId, start: '2022-01-03', finish: '2022-02-09'})
    const medBody2 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId2, property_id: MedPriceId, start: '2022-01-03', finish: '2022-02-09'})

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1,1,1,1,1,1,1],
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        rowSpan: 2,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Дата")]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        columnSpan: 3,
                        margins: TableCellMarginNil,
                        children: [paragraphCentred(resMat1.data.info.Name)]
                    }),

                    new docx.TableCell({
                        columnSpan: 3,
                        margins: TableCellMarginNil,
                        children: [paragraphCentred(resMat2.data.info.Name)]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [priceBlock(resMat1.data.info.Unit)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text(`Изм. ${resMat1.data.info.Unit}`)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Изм. %")]
                            })
                        ]
                    }),

                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [priceBlock(resMat2.data.info.Unit)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text(`Изм. ${resMat2.data.info.Unit}`)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Изм. %")]
                            })
                        ]
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
        columnWidths: [3, 1, 1, 1, 3, 3, 1, 1, 1, 3, 3],
        rows: tableBody(minBody1.data, maxBody1.data, medBody1.data, minBody2.data, maxBody2.data, medBody2.data),
    })

    return paragraph({children: [header, body]})
}