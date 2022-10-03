const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const h1 = require("../atom/heading1");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const {HeaderTitle, MedPriceId, StockId, RusMonth} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const singleTableMinimax = require("../component/table_single_minimax");
const tableDoubleAvg = require("../component/table_double_avg");
const tableDouble = require("../component/table_double");
const tableMaterialMinimax = require("../component/table_material_minimax");
const tableMaterial = require("../component/table_material")
const doubleTableMinimax = require("../component/table_double_minimax")
const {GetWeekDates, GetWeekNumber, Get2LastFridays, Get2LastThursdays} = require("../utils/date_operations");
const {GetMonthRange, Get2WeekRange, GetYearRange} = require("../utils/date_ranges")

function getFooterTitle(date) {

    const weekDates = GetWeekDates(date)
    return `Отчетный период: ${weekDates.first.day} ${RusMonth[weekDates.first.month]} - ` +
        `${weekDates.last.day} ${RusMonth[weekDates.last.month]} ${weekDates.last.year} года (${GetWeekNumber(date)} неделя)`
}

module.exports = class WeeklyReport {

    async generate(date) {
        Get2WeekRange(date)
        return new docx.Document({
            features: {
                updateFields: true,
            },
            sections: [
                {
                    properties: {},
                    footers: {
                        default: footer(getFooterTitle(date)),
                    },
                    headers: {
                        default: header(HeaderTitle)
                    },
                    children: [
                        h1("ЕЖЕНЕДЕЛЬНЫЙ ОТЧЕТ"),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(""),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Краткая сводка новостей по мировову рынку"),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h2("Краткая сводка цен по мировому рынку"),
                        h3("Сырьевые материалы"),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/1_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/4_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/6_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/3_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/7_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/8_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)

                            ]
                        }),


                        h3("Сталь"),
                        paragraph({
                            children: [
                                await oneChart(`http://localhost:8080/getChart/9_${MedPriceId}_${GetYearRange(date)}_0_line.png`)
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/10_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/14_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/12_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/15_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/13_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/16_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),


                        h3("Ферросплавы и руды"),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/17_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/19_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),

                        paragraph({
                            children: [await oneChart(`http://localhost:8080/getChart/18_${MedPriceId}_${GetYearRange(date)}_0_line.png`)]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/20_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/21_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/22_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/23_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Рынок сырьевых материалов"),
                        h3("Железнорудное сырье"),


                        paragraph({ // запасы жел руды в китай протрах
                            children: [await oneChartText(`http://localhost:8080/getChart/28_${StockId}_${GetMonthRange(date)}_0_bar.png`)]
                        }),
                        paragraph({ //жрс 62 и 65
                            children: [await oneChartText(`http://localhost:8080/getChart/1-2_${MedPriceId}_${Get2WeekRange(date)}_1_line.png`)]
                        }),
                        await tableDoubleAvg(1, 2, MedPriceId, Get2WeekRange(date, true)), //жрс 62 и 65

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3("Уголь и кокс"),

                        paragraph({ // коксующийся уголь россия австралия
                            children: [await oneChartText(`http://localhost:8080/getChart/6-7_${MedPriceId}_${Get2WeekRange(date)}_1_line.png`)]
                        }),
                        await tableDoubleAvg(6, 7, MedPriceId, Get2WeekRange(date, true)), // коксующийся уголь россия австралия
                        paragraph({ // мет кокс
                            children: [await oneChartText(`http://localhost:8080/getChart/8_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTable(8, MedPriceId, GetMonthRange(date, true)), // мет кокс
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Лом черных металлов"),
                        paragraph({ // лом 3А
                            children: [await oneChartText(`http://localhost:8080/getChart/3_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTable(4, MedPriceId, GetMonthRange(date, true)),// лом 3А
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),
                        await tableMaterialMinimax([29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], Get2LastFridays(date)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Чугун"),
                        paragraph({ // чугун фоб
                            children: [await oneChartText(`http://localhost:8080/getChart/5_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTableMinimax(5, GetMonthRange(date, true)), // чугун фоб
                        await tableMaterialMinimax([67, 68, 69], Get2LastFridays(date)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок стали"),
                        h3("Полуфабрикаты"),
                        paragraph({ //заготовка, сляб
                            children: [await oneChartText(`http://localhost:8080/getChart/9-11_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await doubleTableMinimax(9, 11, GetMonthRange(date, true)), //заготовка, сляб
                        await tableMaterialMinimax([44, 45, 46, 47, 48, 49, 50], Get2LastFridays(date)),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Сортовой прокат"),
                        paragraph({ //арматура FOB
                            children: [await oneChartText(`http://localhost:8080/getChart/10_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTableMinimax(10, GetMonthRange(date, true)), //арматура FOB
                        await tableMaterialMinimax([51, 52, 53], Get2LastFridays(date)),

                        h3("Плоский прокат"),
                        paragraph({ // рулон гк рулон хк FOB
                            children: [await oneChartText(`http://localhost:8080/getChart/12-13_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3(""),

                        await doubleTableMinimax(12, 13, GetMonthRange(date, true)), // рулон гк рулон хк FOB
                        paragraph({ // рулон гк рулон хк EXW
                            children: [await oneChartText(`http://localhost:8080/getChart/15-16_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await tableDouble(15, 16, MedPriceId, GetMonthRange(date, true)), // рулон гк рулон хк EXW
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),
                        await tableMaterialMinimax(getRangeArr(54, 66), Get2LastFridays(date)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h2("Рынок ферросплавов и руд"),
                        paragraph("Тут странная таблица, позже добавлю"),
                        await tableMaterial(getRangeArr(17, 23), Get2LastThursdays(date)),
                        h3("Ферромарганец и силикон"),
                        paragraph({ // FeMn76, SiMn65
                            children: [await oneChartText(`http://localhost:8080/getChart/17-19_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await doubleTableMinimax(17, 19, GetMonthRange(date, true)), // FeMn76, SiMn65
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Ферросилиций"),
                        paragraph({ // FeSi
                            children: [await oneChartText(`http://localhost:8080/getChart/18_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTableMinimax(18, GetMonthRange(date, true)),// FeSi

                        h3("Феррохром"),
                        paragraph({ // HC LC FeCr
                            children: [await oneChartText(`http://localhost:8080/getChart/20-21_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await doubleTableMinimax(20, 21, GetMonthRange(date, true)), // HC LC FeCr
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3(""),

                        h3("Марганцевая руда"),
                        paragraph({ //mn руда запасы в китае
                            children: [await oneChartText(`http://localhost:8080/getChart/26_${StockId}_${GetMonthRange(date)}_0_bar.png`)]
                        }),
                        paragraph({ //mn руда цена
                            children: [await oneChartText(`http://localhost:8080/getChart/22_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTableMinimax(22, GetMonthRange(date, true)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Хромовая руда"),
                        paragraph({ //хром руда запасы в китае
                            children: [await oneChartText(`http://localhost:8080/getChart/27_${StockId}_${GetMonthRange(date)}_0_bar.png`)]
                        }),
                        paragraph({ //cr руда цена
                            children: [await oneChartText(`http://localhost:8080/getChart/23_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await singleTableMinimax(23, GetMonthRange(date, true)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок графитированых электродов"),
                        paragraph({ //гэ 450 600 мм
                            children: [await oneChartText(`http://localhost:8080/getChart/24-25_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        await tableDouble(24, 25, MedPriceId, GetMonthRange(date, true))

                    ],
                },
            ],
        });
    }
}

function getRangeArr(first, last) {
    let arr = []
    for (let i = first; i <= last; i++) {
        arr.push(i)
    }
    return arr
}

