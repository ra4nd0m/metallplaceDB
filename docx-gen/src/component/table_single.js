const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_body")
const textTh = require("../atom/text_th")

module.exports = async function singleTable(materialId, propertyId, dates, unitChangeRound, percentChangeRound, type){
    const first = new Date(dates[0])
    const last = new Date(dates[1])
    let resBody
    if (type === undefined) type = "day"

    const from = `${first.getFullYear()}-${FormatDayMonth(first.getMonth() + 1)}-${FormatDayMonth(first.getDate())}`
    const to = `${last.getFullYear()}-${FormatDayMonth(last.getMonth() + 1)}-${FormatDayMonth(last.getDate())}`

    const resMat = await axios.post("http://localhost:8080/getMaterialInfo",  { id: materialId })
    if (type === "month"){
        resBody = await axios.post("http://localhost:8080/getMonthlyAvgFeed", { material_source_id: materialId, property_id: propertyId, start: from, finish: to})

    }
    if (type === "day") {
        resBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: propertyId, start: from, finish: to})
    }

    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        rowSpan: 2,
                        children: [textTh("Дата")]
                    }),
                    new  docx.TableCell({
                        columnSpan: 3,
                        children: [textTh(resMat.data.info.Name + " " + resMat.data.info.DeliveryType
                            + " " + resMat.data.info.Market)]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [textTh(`Цена ${resMat.data.info.Unit}`)]
                    }),
                    new docx.TableCell({
                        children: [textTh(`Изм. ${resMat.data.info.Unit}`)]
                    }),
                    new docx.TableCell({
                        children: [textTh("Изм. %")]
                    }),
                ]
            }),
            ...tableBody(resBody.data, unitChangeRound, percentChangeRound, type),
        ]
    })
}