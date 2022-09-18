const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const h1 = require("../atom/heading1");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const {FooterTitle, HeaderTitle, MinPriceId, MaxPriceId, MedPriceId, StockId} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const singleTableMinimax = require("../component/table_single_minimax");
const tableDoubleAvg = require("../component/table_double_avg");
const tableMaterialMinimax = require("../component/table_material_minimax");
const doubleTableMinimax = require("../component/table_double_minimax")
const {GetWeekDates} = require("../utils/date_operations");
const {med} = require


module.exports = class WeeklyReport {

    async generate() {
        const pic = await twoChart(
            `http://localhost:8080/getChart/7_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,
            `http://localhost:8080/getChart/9_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,)

        return new docx.Document({
            features: {
                updateFields: true,
            },
            sections: [
                {
                    properties: {},
                    footers: {
                        default: footer(FooterTitle(GetWeekDates())),
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
                                    'http://localhost:8080/getChart/2_2_01-01-2021_01-01-2022_0_line.png',
                                    'http://localhost:8080/getChart/5_2_01-01-2021_01-01-2022_0_line.png',)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/6_2_01-01-2021_01-01-2022_0_line.png',
                                    'http://localhost:8080/getChart/4_2_01-01-2021_01-01-2022_0_line.png',)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/7_2_01-01-2021_01-01-2022_0_line.png',
                                    'http://localhost:8080/getChart/9_2_01-01-2021_01-01-2022_0_line.png',)

                            ]
                        }),


                        h3("Сталь"),
                        paragraph({
                            children: [
                                await oneChart('http://localhost:8080/getChart/10_2_01-01-2021_01-01-2022_0_line.png')
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/11_2_01-01-2020_01-01-2021_0_line.png',
                                    'http://localhost:8080/getChart/11_2_01-01-2020_01-01-2021_0_line.png',)
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/13_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,
                                    `http://localhost:8080/getChart/16_${MedPriceId}_01-01-2022_10-10-2022_0_line.png`,)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/14_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,
                                    `http://localhost:8080/getChart/17_${MedPriceId}_01-01-2022_10-10-2022_0_line.png`,)
                            ]
                        }),


                        h3("Ферросплавы и руды"),
                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/18_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,
                                    `http://localhost:8080/getChart/20_${MedPriceId}_01-01-2022_10-10-2022_0_line.png`,)
                            ]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(),

                        paragraph({
                            children: [await oneChart(`http://localhost:8080/getChart/19_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`)]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/21_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,
                                    `http://localhost:8080/getChart/22_${MedPriceId}_01-01-2022_10-10-2022_0_line.png`,)
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    `http://localhost:8080/getChart/23_${MedPriceId}_01-01-2021_01-01-2022_0_line.png`,
                                    `http://localhost:8080/getChart/24_${MedPriceId}_01-01-2022_10-10-2022_0_line.png`,)
                            ]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Рынок сырьевых материалов"),
                        h3("Железнорудное сырье"),


                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/27_${StockId}_01-01-2022_02-05-2022_0_bar.png`)]
                        }),
                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/2-7_${MedPriceId}_01-01-2022_01-15-2022_1_line.png`)]
                        }),
                        await tableDoubleAvg(2, 3, MedPriceId),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3("Уголь и кокс"),

                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/7-8_${MedPriceId}_01-01-2022_01-20-2022_1_line.png`)]
                        }),
                        await tableDoubleAvg(7, 8, MedPriceId),
                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/9_${MedPriceId}_01-01-2022_02-05-2022_1_line.png`)]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(""),


                        await singleTable(9,MedPriceId),
                        h3("Лом черных металлов"),
                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/4_${MedPriceId}_01-01-2022_01-20-2022_1_line.png`)]
                        }),
                        await singleTableMinimax(4),
                        await tableMaterialMinimax(),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h3("Чугун"),
                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/6_${MedPriceId}_01-01-2022_02-05-2022_1_line.png`)]
                        }),
                        await singleTableMinimax(6),
                        await tableMaterialMinimax(),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                        h2("Рынок стали"),
                        h3("Полуфабрикаты"),
                        paragraph({
                            children: [await oneChartText(`http://localhost:8080/getChart/10-12_${MedPriceId}_01-01-2022_02-03-2022_1_line.png`)]
                        }),
                        await doubleTableMinimax(10, 12),
                        paragraph({
                            children: [await tableMaterialMinimax()]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),


                         h3("Сортовой прокат"),
                         paragraph({
                             children: [await oneChartText(`http://localhost:8080/getChart/11_${MedPriceId}_01-01-2022_02-03-2022_1_line.png`)]
                         }),
                         await singleTableMinimax(11),
                         paragraph({
                             children: [await tableMaterialMinimax()]
                         }),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),
                         h3(""),
                        // paragraph({
                        //     children: [await oneChartText(`http://localhost:8080/getChart/15_${MedPriceId}_01-01-2022_02-03-2022_1_line.png`)]
                        // }),
                        // await singleTable(15),



                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Остальные таблицы"),
                        paragraph({
                            children: [await singleTable(2, MedPriceId)]
                        }),




                        paragraph({
                            children: [await tableMaterialMinimax()]
                        }),

                        await singleTableMinimax(6),
                        await doubleTableMinimax(6,6 )

                    ],
                },
            ],
        });
    }
}

