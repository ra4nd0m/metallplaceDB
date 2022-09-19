const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");
const {GetWeekDates, FormatDayMonth} = require("../utils/date_operations");
const tableBody = require("../atom/table_single_body")

module.exports = async function singleTable(materialId, propertyId){
    const dates = GetWeekDates()
    const from = `${dates.first.year}-${FormatDayMonth(dates.first.month)}-${FormatDayMonth(dates.first.day)}`
    const to = `${dates.last.year}-${FormatDayMonth(dates.last.month)}-${FormatDayMonth(dates.last.day)}`

    const resMat = await axios.post("http://localhost:8080/getMaterialInfo",  { id: materialId })
    const resBody = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: propertyId, start: '2022-06-03', finish: '2022-06-09'})

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