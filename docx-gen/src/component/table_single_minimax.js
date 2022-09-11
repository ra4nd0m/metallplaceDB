const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const paragraphCentred = require("../atom/paragraph_centred");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_minimax_body")

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

module.exports = async function singleTableMinimax(materialId) {
    const dates = GetWeekDates()
    const from = `${dates.first.year}-${FormatDayMonth(dates.first.month)}-${FormatDayMonth(dates.first.day)}`
    const to = `${dates.last.year}-${FormatDayMonth(dates.last.month)}-${FormatDayMonth(dates.last.day)}`

    const resMat = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId})
    const minBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MinPriceId, start: '2022-01-03', finish: '2022-02-09'})
    const maxBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MaxPriceId, start: '2022-01-03', finish: '2022-02-09'})
    const medBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: '2022-01-03', finish: '2022-02-09'})
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