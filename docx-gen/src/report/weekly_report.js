const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const h1 = require("../atom/heading1");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const h3Fake = require("../atom/heading3_fake");
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
const doubleTableMinimax = require("../component/table_double_minimax")
const tableMaterialGrouped = require("../component/table_material_grouped")
const {GetWeekDates, GetWeekNumber, Get2LastFridays, Get2LastThursdays} = require("../utils/date_operations");
const {GetMonthRange, Get2WeekRange, GetYearRange} = require("../utils/date_ranges")
const {ChartUrl, FormChartUrl} = require("../utils/form_chart_url")
const fs = require("fs");

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
                        new docx.Paragraph({
                            children: [
                                new docx.ImageRun({
                                    data: fs.readFileSync("/home/ivan/Pictures/Screenshots/pic.png"),
                                    transformation: {
                                        width: 1000,
                                        height: 2000,
                                    },
                                }),
                            ]
                        }),
                    ]
                },
                {
                    footers: {
                        default: footer(getFooterTitle(date)),
                    },
                    headers: {
                        default: header(HeaderTitle)
                    },
                    children: [
                        h3("Содержание"),

                        paragraph("Дисклеймер: Информация, представленная на портале metallplace.ru предназначена только для справки и\n" +
                            "не предназначена для торговых целей или для удовлетворения ваших конкретных требований. Контент\n" +
                            "включает факты, взгляды и мнения отдельных лиц, а не веб-сайта или его руководства.\n"),
                        paragraph("Пользователи/посетители должны принимать собственные решения на основе собственных независимых\n" +
                            "запросов, оценок, суждений и рисков. Портал metallplace.ru не несет ответственность за какие-либо убытки,\n" +
                            "затраты или действия, возникающие в результате использования распространяемых цен."),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Краткая сводка новостей по мировову рынку"),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h2("Краткая сводка цен по мировому рынку"),
                        h3Fake("Сырьевые материалы"),
                        paragraph({
                            children: [
                                await twoChart( // ЖРС62 ЛОМ hms
                                    FormChartUrl(new ChartUrl([1], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([4], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart( //чугун лом3а
                                    FormChartUrl(new ChartUrl([5], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([3], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart( //уголь кокс, кокс мет
                                    FormChartUrl(new ChartUrl([6], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([8], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),


                        h3Fake("Сталь"),
                        paragraph({
                            children: [
                                await oneChart(
                                    FormChartUrl(new ChartUrl([9], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([10], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([14], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([12], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([15], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([13], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([16], MedPriceId, GetYearRange(date), 0, "line")),
                                )
                            ]
                        }),


                        h3Fake("Ферросплавы и руды"),
                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([17], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([19], MedPriceId, GetYearRange(date), 0, "line")),
                                    2
                                )
                            ]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),

                        paragraph({
                            children: [await oneChart(
                                FormChartUrl(new ChartUrl([18], MedPriceId, GetYearRange(date), 0, "line")),
                                2
                            )]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([20], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([21], MedPriceId, GetYearRange(date), 0, "line")),
                                    2
                                )
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    FormChartUrl(new ChartUrl([22], MedPriceId, GetYearRange(date), 0, "line")),
                                    FormChartUrl(new ChartUrl([23], MedPriceId, GetYearRange(date), 0, "line")),
                                    2
                                )
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Рынок сырьевых материалов"),
                        h3("Железнорудное сырье"),


                        paragraph({ // запасы жел руды в китай портах
                            children: [await oneChartText(FormChartUrl(new ChartUrl([28], StockId, GetMonthRange(date), 1, "bar")))]
                        }),
                        paragraph({ //жрс 62 и 65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([1,2], MedPriceId, Get2WeekRange(date), 1, "line")))]
                        }),
                        await tableDoubleAvg(1, 2, MedPriceId, Get2WeekRange(date, true), 2, 1), //жрс 62 и 65

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3("Уголь и кокс"),

                        paragraph({ // коксующийся уголь россия австралия
                            children: [await oneChartText(FormChartUrl(new ChartUrl([6,7], MedPriceId, Get2WeekRange(date), 1, "line")))]
                        }),
                        await tableDoubleAvg(6, 7, MedPriceId, Get2WeekRange(date, true), 0, 1), // коксующийся уголь россия австралия
                        paragraph({ // мет кокс
                            children: [await oneChartText(FormChartUrl(new ChartUrl([8], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTable(8, MedPriceId, GetMonthRange(date, true)), // мет кокс
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Лом черных металлов"),
                        await tableMaterialMinimax([29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], Get2LastFridays(date), 0, 1),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),
                        paragraph({ // лом 3А
                            children: [await oneChartText(FormChartUrl(new ChartUrl([3], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTable(3, MedPriceId, GetMonthRange(date, true)),// лом 3А
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Чугун"),
                        paragraph({ // чугун фоб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([5], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTableMinimax(5, GetMonthRange(date, true)), // чугун фоб
                        await tableMaterialMinimax([67, 68, 69], Get2LastFridays(date)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок стали"),
                        h3("Полуфабрикаты"),
                        await tableMaterialMinimax([44, 45, 46, 47, 48, 49, 50], Get2LastFridays(date), 0, 1),
                        paragraph({ //заготовка, сляб
                            children: [await oneChartText(FormChartUrl(new ChartUrl([9,11], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await doubleTableMinimax(9, 11, GetMonthRange(date, true)), //заготовка, сляб
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Сортовой прокат"),
                        await tableMaterialMinimax([51, 52, 53], Get2LastFridays(date)),
                        paragraph({ //арматура FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([10], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTableMinimax(10, GetMonthRange(date, true)), //арматура FOB
                        paragraph({ //арматура A1 EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([14], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTable(14, MedPriceId, GetMonthRange(date, true)), //арматура A1 EXW
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Плоский прокат"),
                        paragraph({ // рулон гк рулон хк FOB
                            children: [await oneChartText(FormChartUrl(new ChartUrl([12,13], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),

                        await tableMaterialMinimax(getRangeArr(54, 66), Get2LastFridays(date)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),
                        await doubleTableMinimax(12, 13, GetMonthRange(date, true), 0, 1), // рулон гк рулон хк FOB
                        paragraph({ // рулон гк рулон хк EXW
                            children: [await oneChartText(FormChartUrl(new ChartUrl([15,16], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await tableDouble(15, 16, MedPriceId, GetMonthRange(date, true)), // рулон гк рулон хк EXW
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок ферросплавов и руд"),
                        paragraph("Сводная таблица:"),
                        await tableMaterialGrouped(getRangeArr(17, 23), Get2LastThursdays(date),
                            [0, 5],
                            ["Ферросплавы (DDP Европа)", "Руда (CIF Китай)"]),
                        h3("Ферромарганец и силиконсарганец"),
                        paragraph({ // FeMn76, SiMn65
                            children: [await oneChartText(FormChartUrl(new ChartUrl([17,19], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await doubleTableMinimax(17, 19, GetMonthRange(date, true), 0, 1), // FeMn76, SiMn65
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3("Ферросилиций"),
                        paragraph({ // FeSi
                            children: [await oneChartText(FormChartUrl(new ChartUrl([18], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTableMinimax(18, GetMonthRange(date, true)),// FeSi

                        h3("Феррохром"),
                        paragraph({ // HC LC FeCr
                            children: [await oneChartText(FormChartUrl(new ChartUrl([20,21], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await doubleTableMinimax(20, 21, GetMonthRange(date, true), 0, 1), // HC LC FeCr
                        new docx.Paragraph({children: [new docx.PageBreak()]}),

                        h3(""),

                        h3("Марганцевая руда"),
                        paragraph({ //mn руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([26], StockId, GetMonthRange(date), 1, "bar")))]
                        }),
                        paragraph({ //mn руда цена
                            children: [await oneChartText(FormChartUrl(new ChartUrl([22], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTableMinimax(22, GetMonthRange(date, true)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Хромовая руда"),
                        paragraph({ //хром руда запасы в китае
                            children: [await oneChartText(FormChartUrl(new ChartUrl([27], StockId, GetMonthRange(date), 1, "bar")))]
                        }),
                        paragraph({ //cr руда цена
                            children: [await oneChartText(FormChartUrl(new ChartUrl([23], MedPriceId, GetMonthRange(date), 1, "line")))]
                        }),
                        await singleTableMinimax(23, GetMonthRange(date, true)),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок графитированых электродов"),
                        paragraph({ //гэ 450 600 мм
                            children: [await oneChartText(FormChartUrl(new ChartUrl([24,25], MedPriceId, GetMonthRange(date), 1, "line")))]
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
