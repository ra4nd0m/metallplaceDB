const docx = require("docx");
const textTh = require("../atom/text_th")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const tableBody = require("../atom/table_double_minimax_body")
const {formatDateDb} = require("../utils/date_format");
const priceBlock = require("../atom/price_block")
const cellCenter = require("../atom/cell_centred")

module.exports = async function doubleTableMinimax(materialId1, materialId2, dates) {
    const from = formatDateDb(dates[0])
    const to = formatDateDb(dates[1])

    const resMat1 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId1})
    const minBody1 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId1,
        property_id: MinPriceId,
        start: from,
        finish: to
    })
    const maxBody1 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId1,
        property_id: MaxPriceId,
        start: from,
        finish: to
    })
    const medBody1 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId1,
        property_id: MedPriceId,
        start: from,
        finish: to
    })

    const resMat2 = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId2})
    const minBody2 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId2,
        property_id: MinPriceId,
        start: from,
        finish: to
    })
    const maxBody2 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId2,
        property_id: MaxPriceId,
        start: from,
        finish: to
    })
    const medBody2 = await axios.post("http://localhost:8080/getValueForPeriod", {
        material_source_id: materialId2,
        property_id: MedPriceId,
        start: from,
        finish: to
    })

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [2, 3, 1, 1, 3, 1, 1],
        rows: [
            new docx.TableRow({
                children: [
                    cellCenter({
                        rowSpan: 2,
                        children: [

                            textTh("Дата")
                        ]
                    }),
                    cellCenter({
                        columnSpan: 3,
                        margins: TableCellMarginNil,
                        children: [textTh(resMat1.data.info.Name)]
                    }),

                    cellCenter({
                        columnSpan: 3,
                        margins: TableCellMarginNil,
                        children: [textTh(resMat2.data.info.Name)]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [priceBlock(resMat1.data.info.Unit)]
                            })
                        ]
                    }),
                    cellCenter({
                        children: [textTh(`Изм. ${resMat1.data.info.Unit}`)]
                    }),
                    cellCenter({
                        children: [textTh("Изм. %")]
                    }),

                    cellCenter({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [priceBlock(resMat2.data.info.Unit)]
                            })
                        ]
                    }),
                    cellCenter({
                        children: [textTh(`Изм. ${resMat2.data.info.Unit}`)]
                    }),
                    cellCenter({
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
        columnWidths: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        rows: tableBody(minBody1.data, maxBody1.data, medBody1.data, minBody2.data, maxBody2.data, medBody2.data),
    })
    return paragraph({children: [header, body]})
}