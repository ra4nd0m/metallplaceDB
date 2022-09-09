const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header")
const text = require("../atom/text")
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const {SpacingDefault, FooterTitle, HeaderTitle} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const singleTableMinimax = require("../component/table_single_minimax");
const tableDoubleWithWeekAvg = require("../component/table_double_week_avg");
const tableMaterialMinimax = require("../component/table_material_minimax")
const {GetWeekDates, GetWeekNumber} = require("../utils/date_operations")


module.exports = class WeeklyReport {

    async generate() {
        const pic = await twoChart(
            'http://localhost:8080/getChart/7_2_01-01-2021_01-01-2022_0.png',
            'http://localhost:8080/getChart/9_2_01-01-2021_01-01-2022_0.png',)

        return new docx.Document({
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
                        h2("Краткая сводка цен по мировому рынку"),
                        h3("Сырьевые материалы"),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/2_2_01-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/5_2_01-01-2021_01-01-2022_0.png',)
                            ]
                        }),
                        new docx.Paragraph({children:[new docx.PageBreak()]}),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/6_2_01-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/4_2_01-01-2021_01-01-2022_0.png',)
                            ]
                        }),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/7_2_01-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/9_2_01-01-2021_01-01-2022_0.png',)

                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/7_2_01-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/9_2_01-01-2021_01-01-2022_0.png',)
                            ]
                        }),


                     new docx.Paragraph({children:[new docx.PageBreak()]}),
                        h3("Сталь"),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/10_2_01-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/11_2_01-01-2021_01-01-2022_0.png',),
                            ]
                        }),

                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/10_2_01-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/11_2_01-01-2021_01-01-2022_0.png',)
                            ]
                        }),
                        paragraph({
                            children: [await oneChart('http://localhost:8080/getChart/13_2_11-01-2021_01-01-2022_0.png')]
                        }),


                        paragraph({
                            children: [await oneChartText('http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png')]
                        }),

                        new docx.Paragraph({children:[new docx.PageBreak()]}),
                        h2("Таблицы"),
                        paragraph({
                            children: [await singleTable(2, 5)]
                        }),
                        paragraph({
                            children: [await tableDoubleWithWeekAvg(2, 3)]
                        }),
                        paragraph({
                            children: [await tableMaterialMinimax()]
                        }),
                        paragraph({
                            children: [await singleTableMinimax(2)]
                        }),
                    ],
                },
            ],
        });
    }
}

