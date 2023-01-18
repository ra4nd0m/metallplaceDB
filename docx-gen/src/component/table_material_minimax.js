const docx = require("docx");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId,
    FontFamilyMedium,
    FontSizeThMain,
    FontFamilyThin,
    FontSizeThExtraInfo
} = require("../const");
const textTh = require("../atom/text_th")
const tableBody = require("../atom/table_material_minimax_body");
const axios = require("axios");
const {FormatDayMonth, GetWeekNumber} = require("../utils/date_operations");
const paragraph = require("../atom/paragraph");
const cellCenter = require("../atom/cell_centred")

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
                    cellCenter({children:[textTh(`мин`)], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({children:[textTh(`макс`)], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({children:[textTh(`сред`)], verticalAlign: docx.VerticalAlign.CENTER}),
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
                    cellCenter({margins: TableCellMarginNil, children: [priceBlock(unit)], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(`Изм ${unit}`)], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({margins: TableCellMarginNil, children: [textTh(`Изм %`)], verticalAlign: docx.VerticalAlign.CENTER})
                ],
            }),
        ]
    })
}

module.exports = async function tableMaterialMinimax(materialIds, dates, unitChangeRound, percentChangeRound, type) {
    const f = new Date(dates[0])
    const s = new Date(dates[1])
    if(type === undefined) type = "week"

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
            Country: location[0],
            Type: matInfo[1],
            DeliveryType: resMat.data.info.DeliveryType,
            DeliveryLocation: location[1],
            Week1Min: week1Min.data,
            Week1Max: week1Max.data,
            Week1Med: week1Med.data,
            Week2Min: week2Min.data,
            Week2Max: week2Max.data,
            Week2Med: week2Med.data,
        })
    }
    let title1, title2
    if (type === "week"){
        title1 = `${GetWeekNumber(dates[0])} неделя ${dates[0].getFullYear()} год`
            title2 = `${GetWeekNumber(dates[1])} неделя ${dates[1].getFullYear()} год`
    }
    if (type === "month"){
        title1 = createTitle(dates[0]);
        title2 = createTitle(dates[1]);
    }

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [2,1,5,5],
        rows:[
            new docx.TableRow({
                children: [
                    cellCenter({ margins: TableCellMarginNil, children: [textTh("Страна/вид")], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({ margins: TableCellMarginNil, children: [textTh("Усл. поставки")], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({ margins: TableCellMarginNil, children: [headerMaterial(title1, "USD/т")], verticalAlign: docx.VerticalAlign.CENTER}),
                    cellCenter({ margins: TableCellMarginNil, children: [headerMaterial(title2, "USD/т")], verticalAlign: docx.VerticalAlign.CENTER}),
                ],
            })
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        rows: tableBody(bodyInfo, unitChangeRound, percentChangeRound),
    })

    return paragraph({children: [header, body]})
}

function createTitle(date){
    const monthYearString = date.toLocaleString("ru", { month: "long", year: "numeric" });
    return monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1)
}
