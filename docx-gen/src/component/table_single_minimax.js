const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const paragraphCentred = require("../atom/paragraph_centred");
const {FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_minimax_body")
const textTh = require("../atom/text_th")
const priceBlock = require("../atom/price_block")


module.exports = async function singleTableMinimax(materialId, dates) {
    const first = new Date(dates[0])
    const last = new Date(dates[1])

    const from = `${first.getFullYear()}-${FormatDayMonth(first.getMonth() + 1)}-${FormatDayMonth(first.getDate())}`
    const to = `${last.getFullYear()}-${FormatDayMonth(last.getMonth() + 1)}-${FormatDayMonth(last.getDate())}`

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
                        children: [textTh("Дата")],
                    }),
                    new docx.TableCell({
                        alignment: docx.AlignmentType.CENTER,
                        columnSpan: 3,
                        margins: TableCellMarginNil,
                        children: [
                            textTh(resMat.data.info.Name)
                        ]
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
                        children: [textTh(`Изм. ${resMat.data.info.Unit}`)]
                    }),
                    new docx.TableCell({
                        children: [textTh("Изм. %")]
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