const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const h1 = require("../atom/heading1");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const h3Fake = require("../atom/heading3_fake");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const { WeeklyHeaderTitle, MedPriceId, StockId, RusMonth, FontFamilyThin} = require("../const");
const coverDates = require("../atom/cover_dates")
const oneChartText = require("../component/one_chart_text");
const cover = require("../atom/cover")
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const singleTableMinimax = require("../component/table_single_minimax");
const tableDoubleAvg = require("../component/table_double_avg");
const tableDouble = require("../component/table_double");
const tableMaterialMinimax = require("../component/table_material_minimax");
const doubleTableMinimax = require("../component/table_double_minimax")
const tableMaterialGrouped = require("../component/table_material_grouped")
const {
    GetDates,
    GetWeekNumber,
    Get2LastFridays,
    Get2LastThursdays,
    GetLastDayOfWeek
} = require("../utils/date_operations");
const {GetMonthRange, Get2WeekRange, GetYearRange} = require("../utils/date_ranges")
const {ChartUrl, FormChartUrl} = require("../utils/form_chart_url")
const fs = require("fs");
const text = require("../atom/text");

function getFooterTitle(date) {
    const weekDates = GetDates(date, "week")
    return `Отчетный период: ${weekDates.first.day} ${RusMonth[weekDates.first.month]} - ` +
        `${weekDates.last.day} ${RusMonth[weekDates.last.month]} ${weekDates.last.year} года (${GetWeekNumber(date)} неделя)`
}

function getCoverTitles(date) {
    const weekDates = GetDates(date, "week")
    return [
        `${GetWeekNumber(date)} неделя ${weekDates.last.year} года`,
        `(${weekDates.first.day} ${RusMonth[weekDates.first.month]} - ${weekDates.last.day} ${RusMonth[weekDates.last.month]})`
    ]
}

module.exports = class WeeklyReport {

    async generate(date) {
        date = GetLastDayOfWeek(date)
        const coverTitles = getCoverTitles(date)
        return new docx.Document({
            features: {
                updateFields: true,
            },
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                            },
                        },
                    },
                    children: [
                        coverDates(coverTitles[0], coverTitles[1]),
                        cover(),
                    ]
                },
                {
                    footers: {
                        default: footer(getFooterTitle(date)),
                    },
                    headers: {
                        default: header(WeeklyHeaderTitle)
                    },
                    properties: {
                        page: {
                            margin: {
                                right: 800,
                                left: 800,
                            },
                        },
                    },
                    children: [
                        h3Fake("Содержание"),

                        paragraph({
                            children: [new docx.TextRun({
                                text: "Дисклеймер: Информация, представленная на портале metallplace.ru предназначена только для справки и" +
                                    "не предназначена для торговых целей или для удовлетворения ваших конкретных требований. Контент" +
                                    "включает факты, взгляды и мнения отдельных лиц, а не веб-сайта или его руководства.",
                                font: FontFamilyThin,
                                color: '#808080'
                            })]
                        }),
                        paragraph({
                            children: [new docx.TextRun({
                                text: "Пользователи/посетители должны принимать собственные решения на основе собственных независимых" +
                                    "запросов, оценок, суждений и рисков. Портал metallplace.ru не несет ответственность за какие-либо убытки," +
                                    "затраты или действия, возникающие в результате использования распространяемых цен.",
                                font: FontFamilyThin,
                                color: '#808080'
                            })]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Краткая сводка новостей по мировову рынку"),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h2("Краткая сводка цен по мировому рынку"),
                        h3Fake("Сырьевые материалы"),
                        paragraph({
                            children: [
                                await twoChart( // ЖРС62 ЛОМ hms
                                    FormChartUrl(new ChartUrl([1], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([4], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    [5, undefined],
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart( //чугун лом3а
                                    FormChartUrl(new ChartUrl([5], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([3], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart( //уголь кокс, кокс мет
                                    FormChartUrl(new ChartUrl([6], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([8], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    [5, undefined]
                                )
                            ]
                        }),


                        h3Fake("Сталь"),
                        paragraph({
                            children: [
                                await oneChart(
                                    FormChartUrl(new ChartUrl([9], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                )
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([10], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([14], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                )
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([12], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([15], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([13], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([16], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                )
                            ]
                        }),


                        h3Fake("Ферросплавы и руды"),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([17], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([19], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    [2, 2]
                                )
                            ]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),

                        paragraph({
                            children: [await oneChart(
                                FormChartUrl(new ChartUrl([18], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                2
                            )]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([20], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([21], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    [2, 2]
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([22], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    FormChartUrl(new ChartUrl([23], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1)),
                                    [2, 2]
                                )
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Рынок сырьевых материалов"),
                        h3("Железнорудное сырье"),


                        paragraph({ // запасы жел руды в китай портах
                            children: [await oneChartText(FormChartUrl(new ChartUrl([28], StockId, GetMonthRange(date), 1, "bar", "day", "day", 1, -1)))]
                        }),
                        paragraph({ //жрс 62 и 65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([1, 2], MedPriceId, Get2WeekRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await tableDoubleAvg(1, 2, MedPriceId, Get2WeekRange(date, true), 2, 1, 1, -1), //жрс 62 и 65

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3("Уголь и кокс"),

                        paragraph({ // коксующийся уголь россия австралия
                            children: [await oneChartText(FormChartUrl(new ChartUrl([6, 7], MedPriceId, Get2WeekRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await tableDoubleAvg(6, 7, MedPriceId, Get2WeekRange(date, true), 0, 1, 0, -1), // коксующийся уголь россия австралия
                        paragraph({ // мет кокс
                            children: [await oneChartText(FormChartUrl(new ChartUrl([8], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTable(8, MedPriceId, GetMonthRange(date, true)), // мет кокс
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Лом черных металлов"),
                        await tableMaterialMinimax([29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], Get2LastFridays(date), 0, 1, "week"),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),
                        paragraph({ // лом 3А
                            children: [await oneChartText(FormChartUrl(new ChartUrl([3], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTableMinimax(3, GetMonthRange(date, true), 0, 1),// лом 3А
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Чугун"),
                        paragraph({ // чугун фоб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([5], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTableMinimax(5, GetMonthRange(date, true)), // чугун фоб
                        await tableMaterialMinimax([67, 68, 69], Get2LastFridays(date), 0, 1, "week"),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок стали"),
                        h3("Полуфабрикаты"),
                        await tableMaterialMinimax([44, 45, 46, 47, 48, 49, 50], Get2LastFridays(date), 0, 1, "week"),
                        paragraph({ //заготовка, сляб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([9, 11], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await doubleTableMinimax(9, 11, GetMonthRange(date, true), 0, 1), //заготовка, сляб
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Сортовой прокат"),
                        await tableMaterialMinimax([51, 52, 53], Get2LastFridays(date), 0, 1, "week"),
                        paragraph({ //арматура FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([10], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTableMinimax(10, GetMonthRange(date, true), 0, 1), //арматура FOB
                        paragraph({ //арматура A1 EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([14], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTable(14, MedPriceId, GetMonthRange(date, true), 0, 1), //арматура A1 EXW
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Плоский прокат"),
                        await tableMaterialMinimax(getRangeArr(54, 66), Get2LastFridays(date), 0, 1, "week"),
                        paragraph({ // рулон гк рулон хк FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([12, 13], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),
                        await doubleTableMinimax(12, 13, GetMonthRange(date, true), 0, 1), // рулон гк рулон хк FOB
                        paragraph({ // рулон гк рулон хк EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([15, 16], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await tableDouble(15, 16, MedPriceId, GetMonthRange(date, true), 0, 1), // рулон гк рулон хк EXW
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок ферросплавов и руд"),
                        paragraph("Сводная таблица:"),
                        await tableMaterialGrouped(getRangeArr(17, 23), Get2LastThursdays(date),
                            [0, 5],
                            ["Ферросплавы (DDP Европа)", "Руда (CIF Китай)"],
                            "week"
                        ),
                        h3("Ферромарганец и силиконмарганец"),
                        paragraph({ // FeMn76, SiMn65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([17, 19], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await doubleTableMinimax(17, 19, GetMonthRange(date, true), 0, 1), // FeMn76, SiMn65
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Ферросилиций"),
                        paragraph({ // FeSi
                            children: [await oneChartText(FormChartUrl(new ChartUrl([18], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTableMinimax(18, GetMonthRange(date, true)),// FeSi

                        h3("Феррохром"),
                        paragraph({ // HC LC FeCr
                            children: [await oneChartText(FormChartUrl(new ChartUrl([20, 21], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await doubleTableMinimax(20, 21, GetMonthRange(date, true), 0, 1), // HC LC FeCr


                        h3("Марганцевая руда"),
                        paragraph({ //mn руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([26], StockId, GetMonthRange(date), 1, "bar", "day", "day", 1, -1)))]
                        }),
                        paragraph({ //mn руда цена
                            children: [await oneChartText(FormChartUrl(new ChartUrl([22], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTableMinimax(22, GetMonthRange(date, true)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Хромовая руда"),
                        paragraph({ //хром руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([27], StockId, GetMonthRange(date), 1, "bar", "day", "day", 1, -1)))]
                        }),
                        paragraph({ //cr руда цена
                            children: [await oneChartText(FormChartUrl(new ChartUrl([23], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
                        }),
                        await singleTableMinimax(23, GetMonthRange(date, true), 1, 1),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок графитированых электродов"),
                        paragraph({ //гэ 450 600 мм
                            children: [await oneChartText(FormChartUrl(new ChartUrl([24, 25], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, -1)))]
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
