const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const paragraphCentred = require("../atom/paragraph_centred");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_minimax_body")
const {formatDateDb} = require("../utils/date");

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

module.exports = async function singleTableMinimax(materialId, dates) {
    const from = formatDateDb(dates[0])
    const to = formatDateDb(dates[1])

    const resMat = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId})
    const minBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MinPriceId, start: from, finish: to})
    const maxBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MaxPriceId, start: from, finish: to})
    const medBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: from, finish: to})
    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1,1,1,1],
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
                        children: [paragraphCentred(resMat.data.info.Name)]
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
                                children: [priceBlock(resMat.data.info.Unit)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text(`Изм. ${resMat.data.info.Unit}`)]
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
        columnWidths: [3, 1, 1, 1, 3, 3],
        rows: tableBody(minBody.data, maxBody.data, medBody.data),
    })

    return paragraph({children: [header, body]})
}