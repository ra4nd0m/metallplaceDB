const docx = require("docx");
const textArea = require("../atom/text_area");
const pageBreak = require("../atom/page_break");
const separator = require("../atom/separator");
const footer = require("../component/footer");
const header = require("../component/header");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const h3Fake = require("../atom/heading3_fake");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const { HeaderTitle, MedPriceId, StockId, RusMonth, FontFamilyThin, Grey, FontFamily, FontFamilyExtraBold} = require("../const");
const coverDates = require("../atom/cover_dates_weekly")
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
    Get2LastMondays,
    Get2LastThursdays,
    GetLastDayOfWeek
} = require("../utils/date_operations");
const {GetMonthRange, Get2WeekRange, GetYearRange} = require("../utils/date_ranges")
const {ChartUrl, FormChartUrl} = require("../utils/form_chart_url")
const disclaimer = require("../atom/disclaimer");
const tableOfContents = require("../atom/table_of_contents");
const marginGen = require("../utils/margin_gen");

function getFooterTitle(date) {
    const weekDates = GetDates(date, "week")
    return [
        new docx.TextRun({
            color: Grey,
            font: FontFamily,
            text: "Отчетный период: ",
            size: 12 * 2,
        }),
        new docx.TextRun({
            color: Grey,
            font: FontFamilyExtraBold,
            text: `${weekDates.first.day} ${RusMonth[weekDates.first.month]} - ${weekDates.last.day} ${RusMonth[weekDates.last.month]} `,
            size: 12 * 2,
        }),
        new docx.TextRun({
            color: Grey,
            font: FontFamily,
            text: `${weekDates.last.year} года`,
            size: 12 * 2,
        }),
    ]
}

function getCoverTitles(date) {
    const weekDates = GetDates(date, "week")
    return [
        `${GetWeekNumber(date)} неделя`,
        `${weekDates.first.day} ${RusMonth[weekDates.first.month]} — ${weekDates.last.day} ${RusMonth[weekDates.last.month]}`,
        `${weekDates.last.year}`
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
                        coverDates(coverTitles[0], coverTitles[1], coverTitles[2]),
                        cover(),
                        pageBreak()
                    ]
                },
                {
                    footers: {
                        default: footer(getFooterTitle(date)),
                    },
                    headers: {
                        default: header(HeaderTitle)
                    },
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
                        h3Fake("Содержание"),
                        ...tableOfContents(),
                        ...marginGen(20),
                        disclaimer(),

                        h2("Краткая сводка новостей"),
                        textArea(),
                        pageBreak(),

                        h2("Краткая сводка цен по мировому рынку"),
                        h3Fake("Сырьевые материалы"),
                        paragraph({
                            children: [
                                await twoChart( // ЖРС62 ЛОМ hms
                                    FormChartUrl(new ChartUrl([2], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([4], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                    [5, undefined],
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart( //чугун лом3а
                                    FormChartUrl(new ChartUrl([5], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([1], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart( //уголь кокс, кокс мет
                                    FormChartUrl(new ChartUrl([6], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([8], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1,0, 1)),
                                    [5, undefined]
                                )
                            ]
                        }),

                        pageBreak(),

                        h3Fake("Сталь"),
                        paragraph({
                            children: [
                                await oneChart( // заготовка
                                    FormChartUrl(new ChartUrl([9], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                )
                            ]
                        }),


                        paragraph({
                            children: [
                                await twoChart( // арматура
                                    FormChartUrl(new ChartUrl([10], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([14], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // рулон гк
                                    FormChartUrl(new ChartUrl([12], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([15], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // рулон хк
                                    FormChartUrl(new ChartUrl([13], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([16], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, -1, 0, 1)),
                                )
                            ]
                        }),

                        pageBreak(),

                        h3Fake("Ферросплавы и руды"),
                        paragraph({
                            children: [
                                await twoChart( // FeMn SiMn
                                    FormChartUrl(new ChartUrl([17], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([19], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                    [2, 2]
                                )
                            ]
                        }),

                        paragraph({
                            children: [await oneChart( // FeSi
                                FormChartUrl(new ChartUrl([18], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                2
                            )]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // FeCr
                                    FormChartUrl(new ChartUrl([20], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                    FormChartUrl(new ChartUrl([21], MedPriceId, GetYearRange(date), 0, "line", "week", "week", 0, -1, 0, 1)),
                                    [2, 2]
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // mn cr руда
                                    FormChartUrl(new ChartUrl([22], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, 2, 0, 1)),
                                    FormChartUrl(new ChartUrl([23], MedPriceId, GetYearRange(date), 0, "line", "day", "week", 0, 1, 0, 1)),
                                    [2, 2],
                                    undefined,
                                    [2, 1]
                                )
                            ]
                        }),

                        pageBreak(),
                        h2("Рынок сырьевых материалов"),
                        h3("Железорудное сырье"),
                        textArea(),

                        paragraph({ // запасы жел руды в китай портах
                            children: [await oneChartText(FormChartUrl(new ChartUrl([28], StockId, GetMonthRange(date), 1, "bar", "day", "day", 0, 2)),  ["Запасы железной руды в китайских портах","млн тонн"])]
                        }),
                        textArea(),
                        paragraph({ //жрс 62 и 65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([2, 3], MedPriceId, Get2WeekRange(date), 1, "line", "day", "day", 1, 2 )), ["Цены на ЖРС", "$/т CNF Китай"])]
                        }),
                        pageBreak(),
                        separator(),
                        await tableDoubleAvg(2, 3, MedPriceId, Get2WeekRange(date, true), 2, 1, 1, "week"), //жрс 62 и 65

                        h3("Уголь и кокс"),
                        textArea(),

                        paragraph({ // коксующийся уголь россия австралия
                            children: [await oneChartText(FormChartUrl(new ChartUrl([6, 7], MedPriceId, Get2WeekRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на коксующийся уголь", "$/т CRF Китай"])]
                        }),
                        await tableDoubleAvg(6, 7, MedPriceId, Get2WeekRange(date, true), 0, 1, 0, "week"), // коксующийся уголь россия австралия
                        pageBreak(),
                        separator(),
                        textArea(),
                        paragraph({ // мет кокс
                            children: [await oneChartText(FormChartUrl(new ChartUrl([8], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на металлургический кокс", "$/т FOB Китай"])]
                        }),
                        await singleTable(8, MedPriceId, GetMonthRange(date, true)), // мет кокс


                        h3("Лом черных металлов"),
                        textArea(),
                        await tableMaterialMinimax([4,29,30,31,32,33,34,35,36,37,38,39,40,41,42], Get2LastMondays(date), 0, 1, "week", 0),
                        pageBreak(),
                        separator(),
                        textArea(),
                        paragraph({ // лом 3А
                            children: [await oneChartText(FormChartUrl(new ChartUrl([1], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на лом 3А", "₽/т CPT Россия"])]
                        }),
                        await singleTableMinimax(1, GetMonthRange(date, true), 0, 1),// лом 3А


                        h3("Чугун"),
                        textArea(),
                        paragraph({ // чугун фоб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([5], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на чугун", "$/т FOB Россия"])]
                        }),
                        await singleTableMinimax(5, GetMonthRange(date, true), 0, 1, undefined, 0, 0), // чугун фоб
                        textArea(),
                        await tableMaterialMinimax([66, 67, 68], Get2LastMondays(date), 0, 1, "week", 0),
                        pageBreak(),
                        separator(),

                        h2("Рынок стали"),
                        h3("Полуфабрикаты"),
                        textArea(),
                        await tableMaterialMinimax([43, 44, 45, 46, 47, 48, 49], Get2LastMondays(date), 0, 1, "week", 0),
                        textArea(),
                        paragraph({ //заготовка, сляб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([9, 11], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на стальные полуфабрикаты", "$/т FOB Россия"])]
                        }),

                        await doubleTableMinimax(9, 11, GetMonthRange(date, true), 0, 1, "week", 0), //заготовка, сляб



                        h3("Сортовой прокат"),
                        textArea(),
                        await tableMaterialMinimax([50, 51, 52], Get2LastMondays(date), 0, 1, "week", 0),
                        textArea(),
                        paragraph({ //арматура FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([10], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на арматуру", "$/т FOB Россия"])]
                        }),
                        pageBreak(),
                        textArea(),

                        await singleTableMinimax(10, GetMonthRange(date, true), 0, 1), //арматура FOB
                        textArea(),
                        paragraph({ //арматура A1 EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([14], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на арматуру А1", "₽/т EXW Россия"])]
                        }),
                        await singleTable(14, MedPriceId, GetMonthRange(date, true), 0, 1, undefined, false, 0), //арматура A1 EXW

                        h3("Плоский прокат"),
                        textArea(),
                        await tableMaterialMinimax(getRangeArr(53, 65), Get2LastMondays(date), 0, 1, "week", 0),
                        textArea(),
                        paragraph({ // рулон гк рулон хк FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([12, 13], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на плоский прокат", "$/т FOB Россия"])]
                        }),

                        pageBreak(),

                        separator(),
                        await doubleTableMinimax(12, 13, GetMonthRange(date, true), 0, 1, "week", 0), // рулон гк рулон хк FOB
                        textArea(),
                        paragraph({ // рулон гк рулон хк EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([15, 16], MedPriceId, GetMonthRange(date), 1, "line", "day", "day", 1, 0)), ["Цены на плоский прокат", "₽/т EXW Россия"])]
                        }),
                        await tableDouble(15, 16, MedPriceId, GetMonthRange(date, true), 0, 1, undefined, false, 0), // рулон гк рулон хк EXW


                        h2("Рынок ферросплавов и руд"),
                        await tableMaterialGrouped(
                            getRangeArr(17, 23),
                            Get2LastThursdays(date),
                            [0, 5],
                            ["Ферросплавы", "Руда"],
                            "week",
                            [0,0,0,1,1,2,1],
                            [0,0,0,1,1,1,1]
                        ),
                        h3("Ферромарганец и силикомарганец"),
                        textArea(),
                        paragraph({ // FeMn76, SiMn65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([17, 19], MedPriceId, GetMonthRange(date, false, true), 1, "line", "day", "day", 1, 0)), ["Цены на марганцевые сплавы", "$/т DDP ЕС"])]
                        }),
                        await doubleTableMinimax(17, 19, GetMonthRange(date, true, true), 0, 1, "week", 0), // FeMn76, SiMn65


                        h3("Ферросилиций"),
                        textArea(),
                        paragraph({ // FeSi
                            children: [await oneChartText(FormChartUrl(new ChartUrl([18], MedPriceId, GetMonthRange(date, false, true), 1, "line", "day", "day", 1, 0)), ["Цены на ферросилиций", "$/т DDP ЕС"])]
                        }),
                        await singleTableMinimax(18, GetMonthRange(date, true, true), 0, 1, undefined, 0),// FeSi

                        h3("Феррохром"),
                        textArea(),
                        paragraph({ // HC LC FeCr
                            children: [await oneChartText(FormChartUrl(new ChartUrl([20, 21], MedPriceId, GetMonthRange(date, false, true), 1, "line", "day", "day", 1, 1)), ["Цены на феррохром", "¢/фунт Cr DDP ЕС"])]
                        }),
                        pageBreak(),
                        separator(),
                        await doubleTableMinimax(20, 21, GetMonthRange(date, true, true), 1, 1, "week", 1), // HC LC FeCr


                        h3("Марганцевая руда"),
                        textArea(),
                        paragraph({ //mn руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([26], StockId, GetMonthRange(date), 1, "bar", "day", "day", 0, 3)), ["Запасы марганцевой руды в китайских портах", "млн тонн"])]
                        }),
                        textArea(),
                        paragraph({ //mn руда цена
                            children: [await oneChartText(FormChartUrl(new ChartUrl([22], MedPriceId, GetMonthRange(date, false, true), 1, "line", "day", "day", 1, 2)), ["Цены на марганцевую руду", "$/1% Mn смт CIF Китай"])]
                        }),
                        await singleTableMinimax(22, GetMonthRange(date, true, true), 2, 1, undefined, 2),


                        h3("Хромовая руда"),
                        textArea(),
                        paragraph({ //хром руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([27], StockId, GetMonthRange(date), 1, "bar", "day", "day", 0, 3)), ["Запасы хромовой руды в китайских портах", "млн тонн"])]
                        }),
                        textArea(),
                        paragraph({ //cr руда цена
                            children: [await oneChartText(FormChartUrl(new ChartUrl([23], MedPriceId, GetMonthRange(date, false, true), 1, "line", "day", "day", 1, 1)), ["Цены на хромовую руду", "$/т CIF Китай"])]
                        }),

                        await singleTableMinimax(23, GetMonthRange(date, true, true), 1, 1, undefined, 1),

                        h2("Рынок графитированных электродов"),
                        textArea(),
                        paragraph({ //гэ 450 600 мм
                            children: [await oneChartText(FormChartUrl(new ChartUrl([24, 25], MedPriceId, GetMonthRange(date, false, false), 1, "line", "day", "day", 1, 0)), ["Цены на графитированные электроды", "$/т EXW Китай"])]
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
