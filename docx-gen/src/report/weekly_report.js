const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header")
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const {SpacingDefault, FooterTitle, HeaderTitle} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const tableDoubleWithWeekAvg = require("../component/table_double_week_avg");
const {GetWeekDates, GetWeekNumber} = require("../utils/date_operations")


module.exports = class WeeklyReport {

    async generate() {
        return new docx.Document({
            sections: [
                {
                    properties: {},
                    footers: {
                        default: footer(FooterTitle(GetWeekDates())),
                    },
                    headers:{
                        default: header(HeaderTitle)
                    },
                    children: [
                        h2("Big heading"),
                        h3("Smaller heading"),
                        paragraph({
                            children: [
                                await twoChart(
                                    'http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png',
                                    'http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png',)
                            ]
                        }),
                        paragraph({
                            spacing: SpacingDefault,
                            children: [await oneChartText('http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png')]
                        }),
                        paragraph({
                            spacing: SpacingDefault,
                            children: [await oneChart('http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png'), new docx.PageBreak()]
                        }),
                        paragraph({
                            spacing: SpacingDefault,
                            children: [await singleTable(2, 5)]
                        }),
                        paragraph({
                            spacing: SpacingDefault,
                            children: [await tableDoubleWithWeekAvg(2, 3)]
                        }),
                    ],
                },
            ],
        });
    }
}

