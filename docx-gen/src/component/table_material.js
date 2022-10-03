const docx = require("docx");
const {TableCellMarginNil, MedPriceId} = require("../const");
const textTh = require("../atom/text_th")
const tableBody = require("../atom/table_material_body");
const axios = require("axios");
const {FormatDayMonth} = require("../utils/date_operations");
const paragraph = require("../atom/paragraph");
const cellCenter = require("../atom/cell_centred")
const {formatDateTable} = require("../utils/date_format")

module.exports = async function(materialIds, dates) {
    const f = new Date(dates[0])
    const s = new Date(dates[1])

    const first = `${f.getFullYear()}-${FormatDayMonth(f.getMonth() + 1)}-${FormatDayMonth(f.getDate())}`
    const second = `${s.getFullYear()}-${FormatDayMonth(s.getMonth() + 1)}-${FormatDayMonth(s.getDate())}`

    let bodyInfo = []

    for (const materialId of materialIds) {
        const resMat = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId})
        const week1Med = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: first, finish: first})
        const week2Med = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: second, finish: second})

        bodyInfo.push({
            Name: resMat.data.info.Name,
            Unit: resMat.data.info.Unit,
            Week1Med: week1Med.data,
            Week2Med: week2Med.data,
        })
    }

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1,1,1,1,1,1],
        rows:[
            new docx.TableRow({
                children: [
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Продукция")]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Ед. измерения")]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(formatDateTable(f))]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(formatDateTable(s))]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(`Изм абс.`)], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(`Изм %`)], verticalAlign: docx.VerticalAlign.CENTER})
                ],
            })
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1,1,1,1,1,1],
        rows: tableBody(bodyInfo),
    })

    return paragraph({children: [header, body]})
}

