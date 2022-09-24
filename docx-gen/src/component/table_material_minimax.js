const docx = require("docx");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const paragraphCentred = require("../atom/paragraph_centred");
const textTh = require("../atom/text_th")
const tableBody = require("../atom/table_material_minimax_body");
const axios = require("axios");
const {FormatDayMonth, GetWeekNumber} = require("../utils/date_operations");
const paragraph = require("../atom/paragraph");

function priceBlock(unit){
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        rows:[
            new docx.TableRow({
                children: [
                    new docx.TableCell({columnSpan: 3, children:[textTh(`Цена, ${unit}`)]})
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({children:[textTh(`мин`)]}),
                    new docx.TableCell({children:[textTh(`макс`)]}),
                    new docx.TableCell({children:[textTh(`сред`)]}),
                ]
            })
        ]
    })
}

function headerMaterial(title, unit){
    return  new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        columnWidths: [3, 1, 1],
        rows: [
            new docx.TableRow({
                children: [new docx.TableCell({columnSpan: 3, margins: TableCellMarginNil, children: [textTh(title)]})]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({margins: TableCellMarginNil, children: [priceBlock(unit)]}),
                    new docx.TableCell({margins: TableCellMarginNil, children: [textTh(`Изм ${unit}`)]}),
                    new docx.TableCell({margins: TableCellMarginNil, children: [textTh(`Изм %`)]})
                ],
            }),
        ]
    })
}

module.exports = async function tableMaterialMinimax(materialIds, dates) {
    const f = new Date(dates[0])
    const s = new Date(dates[1])

    const first = `${f.getFullYear()}-${FormatDayMonth(f.getMonth() + 1)}-${FormatDayMonth(f.getDate())}`
    const second = `${s.getFullYear()}-${FormatDayMonth(s.getMonth() + 1)}-${FormatDayMonth(s.getDate())}`

    let bodyInfo = []

    for (const materialId of materialIds) {
        const resMat = await axios.post("http://localhost:8080/getMaterialInfo", {id: materialId})
        const matInfo = resMat.data.info.Name.split(", ")
        const week1Min = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MinPriceId, start: first, finish: first})
        const week1Max = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MaxPriceId, start: first, finish: first})
        const week1Med = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: first, finish: first})
        const week2Min = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MinPriceId, start: second, finish: second})
        const week2Max = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MaxPriceId, start: second, finish: second})
        const week2Med = await axios.post("http://localhost:8080/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: second, finish: second})

        const location = resMat.data.info.Market.split(", ")
        //"Лом, HMS 1&2 (80:20), FOB, (недельный)"
        bodyInfo.push({
            CountryAndType: `${location[0]} ${matInfo[1]}`,
            Delivery: `${matInfo[2]} ${location[1]}`,
            Week1Min: week1Min.data,
            Week1Max: week1Max.data,
            Week1Med: week1Med.data,
            Week2Min: week2Min.data,
            Week2Max: week2Max.data,
            Week2Med: week2Med.data,
        })
    }
    const week1 = GetWeekNumber(dates[0])
    const week2 = GetWeekNumber(dates[1])

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1,1,5,5],
        rows:[
            new docx.TableRow({
                children: [
                    new docx.TableCell({ margins: TableCellMarginNil, children: [textTh("Страна/вид")]}),
                    new docx.TableCell({ margins: TableCellMarginNil, children: [textTh("Усл. поставки")]}),
                    new docx.TableCell({ margins: TableCellMarginNil, children: [headerMaterial(`${week1} неделя`, "USD/т")]}),
                    new docx.TableCell({ margins: TableCellMarginNil, children: [headerMaterial(`${week2} неделя`, "USD/т")]}),
                ],
            })
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        rows: tableBody(bodyInfo),
    })

    return paragraph({children: [header, body]})
}

