const docx = require("docx");
const {TableNoOuterBorders, TableCellMarginNil, MinPriceId, MaxPriceId, MedPriceId,
    FontFamilyMedium,
    FontSizeThMain,
    FontFamilyThin,
    FontSizeThExtraInfo, FontSizeThSecondary, FontFamily, FontSizeTh, FontFamilySemiBold, ApiEndpoint,
    FontFamilyExtraBold, FatBorder, ThinBorder, BorderNil
} = require("../const");
const textTh = require("../atom/text_th")
const tableBody = require("../atom/table_material_minimax_body");
const axios = require("axios");
const {FormatDayMonth, GetWeekNumber} = require("../utils/date_operations");
const paragraph = require("../atom/paragraph");
const priceBlock = require("../atom/price_block");
const margins = require("../atom/margins");


function headerMaterial(title, unit, font){
    return  new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        columnWidths: [6, 2, 2],
        rows: [
            new docx.TableRow({
                children: [new docx.TableCell({columnSpan: 3, borders: {bottom: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [textTh(title, font, FontSizeThSecondary)]})]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({borders:{top:BorderNil, bottom: BorderNil, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [priceBlock(unit, font)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders:{top:BorderNil, bottom: BorderNil, left: ThinBorder, right: ThinBorder}, children: [textTh(`Изм.`, font, FontSizeThSecondary), textTh(unit, FontFamilyThin, FontSizeThExtraInfo)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders:{top:BorderNil, bottom: BorderNil, left: ThinBorder, right: ThinBorder}, children: [textTh(`Изм.`, font, FontSizeThSecondary), textTh("%", FontFamilyThin, FontSizeThExtraInfo)], verticalAlign: docx.VerticalAlign.CENTER}),
                ],
            }),
        ]
    })
}

module.exports = async function tableMaterialMinimax(materialIds, dates, unitChangeRound, percentChangeRound, type, priceRound) {
    const f = new Date(dates[0])
    const s = new Date(dates[1])
    let endpoint
    if(type === undefined) type = "week"
    if(type === "week") {
        endpoint ="/getWeeklyAvgFeed"
    } else if(type === "month") {
        endpoint ="/getMonthlyAvgFeed"
    }

    const first = `${f.getFullYear()}-${FormatDayMonth(f.getMonth() + 1)}-${FormatDayMonth(f.getDate())}`
    const second = `${s.getFullYear()}-${FormatDayMonth(s.getMonth() + 1)}-${FormatDayMonth(s.getDate())}`

    let bodyInfo = []

    for (const materialId of materialIds) {
        const resMat = await axios.post(ApiEndpoint + `/getMaterialInfo`, {id: materialId})
        let materialType = resMat.data.info.Name.match(/\((.*?)\)/)[1].trim();
        if(materialType.indexOf("(") !== -1) {
            materialType += ")"
        }
        const period1Min = await axios.post(ApiEndpoint + endpoint, { material_source_id: materialId, property_id: MinPriceId, start: first, finish: first})
        const period1Max = await axios.post(ApiEndpoint + endpoint, { material_source_id: materialId, property_id: MaxPriceId, start: first, finish: first})
        const period1Med = await axios.post(ApiEndpoint + endpoint, { material_source_id: materialId, property_id: MedPriceId, start: first, finish: first})
        const period2Min = await axios.post(ApiEndpoint + endpoint, { material_source_id: materialId, property_id: MinPriceId, start: second, finish: second})
        const period2Max = await axios.post(ApiEndpoint + endpoint, { material_source_id: materialId, property_id: MaxPriceId, start: second, finish: second})
        const period2Med = await axios.post(ApiEndpoint + endpoint, { material_source_id: materialId, property_id: MedPriceId, start: second, finish: second})

        const materialCountry =  resMat.data.info.Market.match(/\((.*?)\)/)?.[1].trim();
        const materialFerry=  resMat.data.info.Market.match(/^(.*?)\s*\(/)?.[1].trim();
        bodyInfo.push({
            Country: materialCountry,
            Type: materialType,
            DeliveryType: resMat.data.info.DeliveryType,
            DeliveryLocation: materialFerry,
            Week1Min: period1Min.data,
            Week1Max: period1Max.data,
            Week1Med: period1Med.data,
            Week2Min: period2Min.data,
            Week2Max: period2Max.data,
            Week2Med: period2Med.data,
        })
    }
    let dateTitleFirst, dateTitleSecond
    if (type === "week"){
        dateTitleFirst = `${GetWeekNumber(dates[0])} неделя ${dates[0].getFullYear()} год`
            dateTitleSecond = `${GetWeekNumber(dates[1])} неделя ${dates[1].getFullYear()} год`
    }
    if (type === "month"){
        dateTitleFirst = createTitle(dates[0]);
        dateTitleSecond = createTitle(dates[1]);
    }

    const header = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [5,5,10,10],
        borders: {
            top: FatBorder,
            bottom: FatBorder,
            left: ThinBorder,
            right: ThinBorder
        },
        rows:[
            new docx.TableRow({
                children: [
                    new docx.TableCell({borders:{top:FatBorder, bottom: FatBorder, left: ThinBorder, right: ThinBorder},  margins: TableCellMarginNil, children: [textTh("Страна/вид", FontFamilyExtraBold, FontSizeThMain)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders:{top:FatBorder, bottom: FatBorder, left: ThinBorder, right: ThinBorder},  margins: TableCellMarginNil, children: [textTh("Условия поставки", FontFamilyExtraBold, FontSizeThMain)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders:{top:FatBorder, bottom: FatBorder, left: ThinBorder, right: ThinBorder},  margins: TableCellMarginNil, children: [headerMaterial(dateTitleFirst, "$/т", FontFamily)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders:{top:FatBorder, bottom: FatBorder, left: ThinBorder, right: ThinBorder},  margins: TableCellMarginNil, children: [headerMaterial(dateTitleSecond, "$/т", FontFamilyExtraBold)], verticalAlign: docx.VerticalAlign.CENTER}),
                ],
            })
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        rows: tableBody(bodyInfo, unitChangeRound, percentChangeRound, priceRound),
    })

    return margins([paragraph({children: [header, body]})])
}

function createTitle(date){
    const monthYearString = date.toLocaleString("ru", { month: "long", year: "numeric" });
    return monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1)
}
