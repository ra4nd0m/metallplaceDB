const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const h1 = require("../atom/heading1");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const {FooterTitle, HeaderTitle, MinPriceId, MaxPriceId, MedPriceId} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const singleTableMinimax = require("../component/table_single_minimax");
const tableDoubleAvg = require("../component/table_double_avg");
const tableMaterialMinimax = require("../component/table_material_minimax");
const {GetWeekDates} = require("../utils/date_operations");


module.exports = class WeeklyReport {

    async generate() {
        const pic = await twoChart(
            'http://localhost:8080/getChart/7_2_01-01-2021_01-01-2022_0_line.png',
            'http://localhost:8080/getChart/9_2_01-01-2021_01-01-2022_0_line.png',)

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

                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/7_2_01-01-2021_01-01-2022_0_line.png',
                                    'http://localhost:8080/getChart/9_2_01-01-2021_01-01-2022_0_line.png',)
                            ]
                        }),


                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Рынок сырьевых материалов"),
                        h3("Сталь"),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/10_2_01-01-2021_01-01-2022_0_line.png',
                                    'http://localhost:8080/getChart/11_2_01-01-2021_01-01-2022_0_line.png',),
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/10_2_01-01-2021_01-01-2022_0_line.png',
                                    'http://localhost:8080/getChart/11_2_01-01-2021_01-01-2022_0_line.png',)
                            ]
                        }),
                        paragraph({
                            children: [await oneChart('http://localhost:8080/getChart/13_2_11-01-2021_01-01-2022_0_line.png')]
                        }),
                        paragraph({
                            children: [await oneChartText('http://localhost:8080/getChart/13_2_11-01-2021_01-01-2022_0_bar.png')]
                        }),
                        paragraph({
                            children: [await oneChartText('http://localhost:8080/getChart/2_2_01-01-2021_01-06-2021_1_line.png')]
                        }),

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h2("Таблицы"),
                        paragraph({
                            children: [await singleTable(2, MedPriceId)]
                        }),

                        await tableDoubleAvg(2, 3, MedPriceId),

                        paragraph({
                            children: [await tableMaterialMinimax()]
                        }),

                        await singleTableMinimax(6, MinPriceId, MaxPriceId, MedPriceId)

                    ],
                },
            ],
        });
    }
}

