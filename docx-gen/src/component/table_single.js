const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_body")
const {GetWeekRange} = require("../utils/date_ranges");

module.exports = async function singleTable(materialId, propertyId, dates){
    const first = new Date(dates[0])
    const last = new Date(dates[1])

    const from = `${first.getFullYear()}-${FormatDayMonth(first.getMonth() + 1)}-${FormatDayMonth(first.getDate())}`
    const to = `${last.getFullYear()}-${FormatDayMonth(last.getMonth() + 1)}-${FormatDayMonth(last.getDate())}`

    const resMat = await axios.post("http://localhost:8080/getMaterialInfo",  { id: materialId })
    const resBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: propertyId, start: from, finish: to})

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
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Дата")]
                            })
                        ]
                    }),
                    new  docx.TableCell({
                        columnSpan: 3,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text(resMat.data.info.Name)]
                            })
                        ]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Цена")]
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
            ...tableBody(resBody.data),
        ]
    })
}