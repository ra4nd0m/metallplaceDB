const docx = require("docx");
const {TableCellMarginNil, MedPriceId} = require("../const");
const textTh = require("../atom/text_th")
const tableBody = require("../atom/table_material_grouped_body");
const axios = require("axios");
const {FormatDayMonth} = require("../utils/date_operations");
const paragraph = require("../atom/paragraph");
const cellCenter = require("../atom/cell_centred")
const {formatDateTable} = require("../utils/date_format")

module.exports = async function(materialIds, dates, titlesIndexes, titles, type) {
    const f = new Date(dates[0])
    const s = new Date(dates[1])
    let title1 = f
    let title2 = s
    if(type === undefined) type = "week"
    let med1, med2, feed

    const first = `${f.getFullYear()}-${FormatDayMonth(f.getMonth() + 1)}-${FormatDayMonth(f.getDate())}`
    const second = `${s.getFullYear()}-${FormatDayMonth(s.getMonth() + 1)}-${FormatDayMonth(s.getDate())}`

    let bodyInfo = []

    for (const materialId of materialIds) {
        const resMat = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId})
        if (type === "month"){
            feed = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: first, finish: second})
            feed.data.price_feed.splice(1, feed.data.price_feed.length - 2);
             med1 = {
                "data": {
                    "price_feed": [feed.data.price_feed[0]]
                }
            }
             med2 = {
                "data": {
                    "price_feed": [feed.data.price_feed[1]]
                }
            }
            title1 = new Date(feed.data.price_feed[0].date)
            title2 = new Date(feed.data.price_feed[1].date)
        }
        if (type === "week") {
             med1 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: first, finish: first})
             med2 = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: second, finish: second})
        }

        bodyInfo.push({
            Name: resMat.data.info.Name,
            Market: resMat.data.info.Market,
            DeliveryType : resMat.data.info.DeliveryType,
            Unit: resMat.data.info.Unit,
            Week1Med: med1.data,
            Week2Med: med2.data,
        })
    }

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [2,1,1,1,1,1],
        rows:[
            new docx.TableRow({
                children: [
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Продукция")]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh("Единицы измерения")]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(formatDateTable(new Date(title1)))]}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(formatDateTable(new Date(title2)))]}),
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
        columnWidths: [2,1,1,1,1,1],
        rows: tableBody(bodyInfo, titlesIndexes, titles),
    })

    return paragraph({children: [header, body]})
}

