const docx = require("docx");
const {TableCellMarginNil, MedPriceId, FontFamilyMedium, FontSizeThMain, FontFamilyThin, FontSizeThExtraInfo,
    FontFamilyExtraBold, FontSizeThSecondary, ApiEndpoint, FatBorder, ThinBorder
} = require("../const");
const textTh = require("../atom/text_th")
const tableBody = require("../atom/table_material_grouped_body");
const axios = require("axios");
const {FormatDayMonth} = require("../utils/date_operations");
const paragraph = require("../atom/paragraph");
const cellCenter = require("../atom/cell_centred")
const {formatDateTable} = require("../utils/date_format")
const margins = require("../atom/margins");
const {AddDaysToDate} = require("../utils/date_operations")

module.exports = async function(materialIds, dates, titlesIndexes, titles, type, priceRounds, unitChangeRounds) {
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
        const resMat = await axios.post(ApiEndpoint + "/getMaterialInfo", {id: materialId})
        if (type === "month"){
            feed = await axios.post(ApiEndpoint + "/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: first, finish: second})
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
             med1 = await axios.post(ApiEndpoint + "/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: first, finish: AddDaysToDate(first, 3)})
             med2 = await axios.post(ApiEndpoint + "/getValueForPeriod", { material_source_id: materialId, property_id: MedPriceId, start: second, finish: AddDaysToDate(second, 3)})
            title1 = new Date(med1.data.price_feed[0].date)
            title2 = new Date(med2.data.price_feed[0].date)
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
        borders: {
            top: FatBorder,
            bottom: FatBorder
        },
        columnWidths: [9,3,3,3,2,2],
        rows:[
            new docx.TableRow({
                children: [
                    new docx.TableCell({borders: {top: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [textTh("Продукция", FontFamilyMedium, FontSizeThMain)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders: {top: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [textTh("Единицы измерения", FontFamilyMedium, FontSizeThMain)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders: {top: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [textTh(formatDateTable(new Date(title1)), FontFamilyMedium, FontSizeThMain)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders: {top: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [textTh(formatDateTable(new Date(title2)), FontFamilyExtraBold, FontSizeThMain)], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders: {top: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [
                        textTh(`Изм.`, FontFamilyMedium, FontSizeThMain),
                            textTh(`абс.`, FontFamilyThin, FontSizeThSecondary),
                        ], verticalAlign: docx.VerticalAlign.CENTER}),
                    new docx.TableCell({borders: {top: FatBorder, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil, children: [
                        textTh(`Изм.`, FontFamilyMedium, FontSizeThMain),
                            textTh(`%`, FontFamilyThin, FontSizeThSecondary)
                        ], verticalAlign: docx.VerticalAlign.CENTER})
                ],
            })
        ]
    })

    const body = new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [9,3,3,3,2,2],
        rows: tableBody(bodyInfo, titlesIndexes, titles, priceRounds, unitChangeRounds),
    })

    return margins([paragraph({children: [header, body]})])
}

