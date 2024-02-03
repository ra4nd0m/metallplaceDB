const docx = require("docx");
const textArea = require("../atom/text_area");
const footer = require("../component/footer");
const header = require("../component/header");
const h2 = require("../atom/heading2");
const separator = require("../atom/separator");
const pageBreak = require("../atom/page_break");
const h3 = require("../atom/heading3");
const h3Fake = require("../atom/heading3_fake");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const {HeaderTitle, MedPriceId, StockId, RusMonth, FontFamilyThin, RusMonthStraight,
    FontFamily, FontFamilyExtraBold, Grey
} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const tableDouble = require("../component/table_double");
const tableMaterialMinimax = require("../component/table_material_minimax");
const tableMaterialGrouped = require("../component/table_material_grouped")
const {GetDates, GetFirstDayOfMonth, GetFirstDaysOfCurrentAndPrevMonth} = require("../utils/date_operations");
const {GetNMonthRange} = require("../utils/date_ranges")
const {ChartUrl, FormChartUrl} = require("../utils/form_chart_url")
const coverDates = require("../atom/cover_dates_monthly");
const cover = require("../atom/cover");
const disclaimer = require("../atom/disclaimer")
const tableOfContents = require("../atom/table_of_contents")
const marginGen = require("../utils/margin_gen")

function getFooterTitle(date) {

    const monthDates = GetDates(date, "month")
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
            text: `${monthDates.first.day} ${RusMonth[monthDates.first.month]} - ${monthDates.last.day} ${RusMonth[monthDates.last.month]} `,
            size: 12 * 2,
        }),
        new docx.TextRun({
            color: Grey,
            font: FontFamily,
            text: `${monthDates.last.year} года`,
            size: 12 * 2,
        }),
    ]
}

function getCoverTitles(date){
    const monthDates = GetDates(date, "month")
    return [
        `${RusMonthStraight[monthDates.first.month]}`,
        `${monthDates.last.year}`
    ]
}

module.exports = class MonthlyReport {
    async generate(date) {
        date = GetFirstDayOfMonth(date)
        let lastDayOfMonth = new Date(date)
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1)
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1)
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
                        cover("monthly"),
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
                                    FormChartUrl(new ChartUrl([2], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([4], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ],
                            
                        }),
                       paragraph({
                            children: [
                                await twoChart( //чугун лом3а
                                    FormChartUrl(new ChartUrl([5], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([1], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ],
                            
                        }),
                        paragraph({
                            children: [
                                await twoChart( //уголь кокс, кокс мет
                                    FormChartUrl(new ChartUrl([6], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([8], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ],
                            
                        }),
                        pageBreak(),

                        h3Fake("Сталь"),
                        paragraph({
                            children: [
                                await oneChart( // заготовка
                                    FormChartUrl(new ChartUrl([9], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, 0, 0,1)),
                                    undefined,
                                "м/м"
                                )
                            ]
                        }),


                        paragraph({
                            children: [
                                await twoChart( // арматуры
                                    FormChartUrl(new ChartUrl([10], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([14], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // рулоны гк
                                    FormChartUrl(new ChartUrl([12], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([15], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ]
                        }),


                        paragraph({
                            children: [
                                await twoChart( // рулоны хк
                                    FormChartUrl(new ChartUrl([13], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([16], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ]
                        }),

                        pageBreak(),

                        h3Fake("Ферросплавы и руды"),
                        paragraph({
                            children: [
                                await twoChart( //ферро- силиконмарганец
                                    FormChartUrl(new ChartUrl([17], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([19], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м"
                                )
                            ]
                        }),

                        paragraph({
                            children: [await oneChart( // ферросицилий
                                FormChartUrl(new ChartUrl([18], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, 0, 0,1)),
                                undefined,
                                "м/м"
                            )]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // ву ну феррохром
                                    FormChartUrl(new ChartUrl([20], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([21], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м",
                                    undefined,
                                    [1, 1]
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart( // mn cr руда
                                    FormChartUrl(new ChartUrl([22], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    FormChartUrl(new ChartUrl([23], MedPriceId, GetNMonthRange(date, 23), 0, "line", "month", "month", 0, undefined, 0,1)),
                                    undefined,
                                    "м/м",
                                    [2, 0]
                                )
                            ]
                        }),
                        pageBreak(),



                        h2("Рынок сырьевых материалов"),
                        h3("Железорудное сырье"),
                        textArea(),
                        paragraph({ // запасы жел руды в китай портах
                            children: [await oneChartText(FormChartUrl(new ChartUrl([28], StockId, GetNMonthRange(date, 5), 1, "bar", "month", "month", 0, 2)),  ["Запасы железной руды в китайских портах","млн тонн"])]
                        }),
                        textArea(),
                        paragraph({ //жрс 62 и 65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([2,3], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на ЖРС", "$/т CNF Китай"])]
                        }),
                        await tableDouble(2, 3, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0),


                        h3("Уголь и кокс"),
                        textArea(),
                        paragraph({ // коксующийся уголь россия австралия
                            children: [await oneChartText(FormChartUrl(new ChartUrl([6,7], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на коксующийся уголь", "$/т CRF Китай"])]
                        }),
                        await tableDouble(6, 7, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // коксующийся уголь россия австралия
                        textArea(),
                        paragraph({ // мет кокс
                            children: [await oneChartText(FormChartUrl(new ChartUrl([8], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на металлургический кокс", "$/т FOB Китай"])]
                        }),
                        await singleTable(8, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // мет кокс


                        h3("Лом черных металлов"),
                        textArea(),
                        paragraph({ // лом 3А
                            children: [await oneChartText(FormChartUrl(new ChartUrl([1], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на лом 3А", "₽/т CPT Россия"])]
                        }),
                        await singleTable(1, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0),// лом 3А
                        pageBreak(),
                        separator(),
                        textArea(),
                        await tableMaterialMinimax([4,29,30,31,32,33,34,35,36,37,38,39,40,41,42], GetFirstDaysOfCurrentAndPrevMonth(date), 0, 1, "month", 0),

                        h3("Чугун"),
                        textArea(),
                        paragraph({ // чугун фоб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([5], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на чугун", "$/т FOB Россия"])]
                        }),
                        await singleTable(5, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // чугун фоб
                        textArea(),
                        await tableMaterialMinimax([66, 67, 68], GetFirstDaysOfCurrentAndPrevMonth(date), 0, 1, "month", 0),


                        pageBreak(),
                        h2("Рынок стали"),
                        h3("Полуфабрикаты"),
                        textArea(),
                        paragraph({ // заготовка сляб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([9, 11], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на стальные полуфабрикаты", "$/т FOB Россия"])]
                        }),

                        await tableDouble(9, 11, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // коксующийся уголь россия австралия
                        textArea(),
                        await tableMaterialMinimax([43,44,45,46,47,48,49], GetFirstDaysOfCurrentAndPrevMonth(date), 0, 1, "month", 0),

                        h3("Сортовой прокат"),
                        textArea(),
                        paragraph({ // арматура FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([10], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на арматуру", "$/т FOB Россия"])]
                        }),

                        await singleTable(10, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // арматура FOB
                        textArea(),
                        paragraph({ // арматура A1
                            children: [await oneChartText(FormChartUrl(new ChartUrl([14], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на арматуру А1", "₽/т EXW Россия"])]
                        }),
                        await singleTable(14, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // арматура A1
                        textArea(),
                        await tableMaterialMinimax([50, 51, 52], GetFirstDaysOfCurrentAndPrevMonth(date), 0, 1, "month", 0),

                        h3("Плоский прокат"),
                        textArea(),
                        paragraph({ // гк хк FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([12, 13], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на плоский прокат", "$/т FOB Россия"])]
                        }),
                        await tableDouble(12, 13, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // гк хк FOB
                        textArea(),
                        paragraph({ // гк хк EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([15, 16], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на плоский прокат", "₽/т EXW Россия"])]
                        }),
                        pageBreak(),
                        separator(),
                        await tableDouble(15, 16, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // гк хк EXW
                        textArea(),
                        await tableMaterialMinimax([53,54,55,56,57,58,59,60,61,62,63,64,65], GetFirstDaysOfCurrentAndPrevMonth(date), 0, 1, "month", 0),

                        pageBreak(),
                        h2("Рынок ферросплавов и руд"),
                        await tableMaterialGrouped(
                            [17,18,19,20,21,22,23],
                            [date, lastDayOfMonth],
                            [0, 5],
                            ["Ферросплавы", "Руды"],
                            "month",
                            [0,0,0,1,1,2,1],
                            [0,0,0,1,1,1,1]
                        ),

                        h3("Ферромарганец и силикомарганец"),
                        textArea(),
                        paragraph({ // FeMn SiMn
                            children: [await oneChartText(FormChartUrl(new ChartUrl([17, 19], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на марганцевые сплавы", "$/т DDP ЕС"])]
                        }),
                        await tableDouble(17, 19, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // Ферромарганец и силиконмарганец EXW



                        h3("Ферросилиций"),
                        textArea(),
                        paragraph({ // FeSi
                            children: [await oneChartText(FormChartUrl(new ChartUrl([18], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на ферросилиций", "$/т DDP ЕС"])]
                        }),
                        await singleTable(18, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // FeSi


                        h3("Феррохром"),
                        textArea(),
                        paragraph({ // HC LC FeCr
                            children: [await oneChartText(FormChartUrl(new ChartUrl([20, 21], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на феррохром", "¢/фунт Cr DDP ЕС"])]
                        }),

                        await tableDouble(20, 21, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0), // HC LC FeCr


                        h3("Марганцевая руда"),
                        textArea(),
                        paragraph({ // mn руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([26], StockId, GetNMonthRange(date, 5), 1, "bar", "month", "month", 0, 3)), ["Запасы марганцевой руды в китайских портах", "млн тонн"])]
                        }),
                        textArea(),
                        paragraph({ // mn руда
                            children: [await oneChartText(FormChartUrl(new ChartUrl([22], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 2, 1)), ["Цены на марганцевую руду", "$/1% Mn смт CIF Китай"])]
                        }),
                        pageBreak(),
                        separator(),
                        await singleTable(22, MedPriceId, GetNMonthRange(date, 9, true), 2, 1, "month", 0, 2), // Марганцевая руда


                        h3("Хромовая руда"),
                        textArea(),
                        paragraph({ // cr руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([27], StockId, GetNMonthRange(date, 5), 1, "bar", "month", "month", 0, 3)), ["Запасы хромой руды в китайских портах", "млн тонн"])]
                        }),
                        textArea(),
                        paragraph({ // cr руда
                            children: [await oneChartText(FormChartUrl(new ChartUrl([23], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на хромовую руду", "$/т CIF Китай"])]
                        }),
                        await singleTable(23, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0),

                        pageBreak(),
                        h2("Рынок графитированных электродов"),
                        textArea(),
                        paragraph({ // гэ 450 600 мм
                            children: [await oneChartText(FormChartUrl(new ChartUrl([24, 25], MedPriceId, GetNMonthRange(date, 9), 1, "line", "month", "month", 1, 0, 1)), ["Цены на графитированные электроды", "$/т EXW Китай"])]
                        }),
                        await tableDouble(24, 25, MedPriceId, GetNMonthRange(date, 9, true), 0, 1, "month", 0, 0),
                    ],
                },
            ],
        });
    }
}

