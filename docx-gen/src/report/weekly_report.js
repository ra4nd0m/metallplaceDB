const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const h1 = require("../atom/heading1");
const h2 = require("../atom/heading2");
const h3 = require("../atom/heading3");
const paragraph = require("../atom/paragraph");
const twoChart = require("../component/two_chart");
const { HeaderTitle, MedPriceId, StockId, RusMonth} = require("../const");
const oneChartText = require("../component/one_chart_text");
const oneChart = require("../component/one_chart");
const singleTable = require("../component/table_single");
const singleTableMinimax = require("../component/table_single_minimax");
const tableDoubleAvg = require("../component/table_double_avg");
const tableDouble = require("../component/table_double");
const tableMaterialMinimax = require("../component/table_material_minimax");
const doubleTableMinimax = require("../component/table_double_minimax")
const {GetWeekDates, GetWeekNumber} = require("../utils/date_operations");
const {GetMonthRange, GetWeekRange, Get2WeekRange, GetYearRange, Get} = require("../utils/date_ranges")

function getFooterTitle(date){

    const weekDates = GetWeekDates(date)
    return `Отчетный период: ${weekDates.first.day} ${RusMonth[weekDates.first.month]} - `+
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
                        paragraph(GetMonthRange(date)),
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
                                    `http://localhost:8080/getChart/2_2_${GetYearRange(date)}_0_line.png`,
                                    `http://localhost:8080/getChart/5_2_${GetYearRange(date)}_0_line.png`,)
                            ]
                        }),
                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/6_2_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/4_2_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),
                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/7_2_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/9_2_${GetYearRange(date)}_0_line.png`,)

                             ]
                         }),


                         h3("Сталь"),
                         paragraph({
                             children: [
                                 await oneChart(`http://localhost:8080/getChart/10_2_${GetYearRange(date)}_0_line.png`)
                             ]
                         }),

                         new docx.Paragraph({children: [new docx.PageBreak()]}),
                         h3(),
                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/11_2_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/11_2_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),

                         new docx.Paragraph({children: [new docx.PageBreak()]}),
                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/13_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/16_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),
                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/14_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/17_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),


                         h3("Ферросплавы и руды"),
                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/18_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/20_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),
                         h3(),

                         paragraph({
                             children: [await oneChart(`http://localhost:8080/getChart/19_${MedPriceId}_${GetYearRange(date)}_0_line.png`)]
                         }),

                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/21_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/22_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),

                         paragraph({
                             children: [
                                 await twoChart(
                                     `http://localhost:8080/getChart/23_${MedPriceId}_${GetYearRange(date)}_0_line.png`,
                                     `http://localhost:8080/getChart/24_${MedPriceId}_${GetYearRange(date)}_0_line.png`,)
                             ]
                         }),

                         new docx.Paragraph({children: [new docx.PageBreak()]}),
                         h2("Рынок сырьевых материалов"),
                         h3("Железнорудное сырье"),


                         paragraph({ // запасы жел руды в китай протрах
                             children: [await oneChartText(`http://localhost:8080/getChart/27_${StockId}_${GetMonthRange(date)}_0_bar.png`)]
                         }),
                         paragraph({ //жрс 62 и 65
                             children: [await oneChartText(`http://localhost:8080/getChart/2-7_${MedPriceId}_${Get2WeekRange(date)}_1_line.png`)]
                         }),
                        await tableDoubleAvg(2, 3, MedPriceId, Get2WeekRange(date, true)), //жрс 62 и 65

                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3("Уголь и кокс"),

                        paragraph({ // коксующийся уголь россия австралия
                            children: [await oneChartText(`http://localhost:8080/getChart/7-8_${MedPriceId}_${Get2WeekRange(date)}_1_line.png`)]
                        }),
                        await tableDoubleAvg(7, 8, MedPriceId, Get2WeekRange(date, true)), // коксующийся уголь россия австралия
                        paragraph({ // мет кокс
                            children: [await oneChartText(`http://localhost:8080/getChart/9_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                        }),
                        new docx.Paragraph({children: [new docx.PageBreak()]}),
                        h3(""),


                        await singleTable(9, MedPriceId, GetMonthRange(date, true)), // мет кокс
                         h3("Лом черных металлов"),
                         paragraph({ // лом 3А
                             children: [await oneChartText(`http://localhost:8080/getChart/4_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),
                         await singleTableMinimax(4, GetMonthRange(date, true)),// лом 3А
                         await tableMaterialMinimax(),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),


                         h3("Чугун"),
                         paragraph({ // чугун фоб
                             children: [await oneChartText(`http://localhost:8080/getChart/6_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),
                         await singleTableMinimax(6, GetMonthRange(date, true)), // чугун фоб
                         await tableMaterialMinimax(),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),


                         h2("Рынок стали"),
                         h3("Полуфабрикаты"),
                         paragraph({ //загатовка, сляб
                             children: [await oneChartText(`http://localhost:8080/getChart/10-12_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),
                         await doubleTableMinimax(10, 12, Get2WeekRange(date, true)), //загатовка, сляб
                         paragraph({
                             children: [await tableMaterialMinimax()]
                         }),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),


                          h3("Сортовой прокат"),
                          paragraph({ //арматура FOB
                              children: [await oneChartText(`http://localhost:8080/getChart/11_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                          }),
                          await singleTableMinimax(11, GetMonthRange(date, true)), //арматура FOB
                          await tableMaterialMinimax(),
                          new docx.Paragraph({children: [new docx.PageBreak()]}),

                          h3(""),
                         paragraph({ //арматура А1
                             children: [await oneChartText(`http://localhost:8080/getChart/16_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),


                         h3("Плоский прокат"),
                         paragraph({ // рулон гк рулон хк FOB
                             children: [await oneChartText(`http://localhost:8080/getChart/10-12_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),

                         h3(""),
                         await doubleTableMinimax(10, 12, GetMonthRange(date, true)), // рулон гк рулон хк FOB
                         paragraph({ // рулон гк рулон хк EXW
                             children: [await oneChartText(`http://localhost:8080/getChart/16-17_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),
                         //await tableDoubleAvg(16, 17, MedPriceId, Get2WeekRange(date, true)), // рулон гк рулон хк EXW
                         new docx.Paragraph({children: [new docx.PageBreak()]}),

                         h3(""),
                         await tableMaterialMinimax(),
                         new docx.Paragraph({children: [new docx.PageBreak()]}),

                         h3("Рынок ферросплавов и руд"),
                         paragraph("Тут странная таблица, позже добавлю"),
                         h3("Ферромарганец и силикон"),
                         paragraph({ // FeMn76, SiMn65
                             children: [await oneChartText(`http://localhost:8080/getChart/18-20_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         }),
                         await doubleTableMinimax(18, 20, Get2WeekRange(date, true)), // FeMn76, SiMn65
                         paragraph("...И еще пару страниц далее"),


                         // paragraph({
                         //     children: [await oneChartText(`http://localhost:8080/getChart/15_${MedPriceId}_${GetMonthRange(date)}_1_line.png`)]
                         // }),
                        //  await singleTable(15, MedPriceId, date, true),



                         new docx.Paragraph({children: [new docx.PageBreak()]}),
                         h2("Остальные таблицы"),
                        await tableDouble(2, 7, 2, Get2WeekRange(date, true)),
                         await singleTable(2, MedPriceId, GetMonthRange(date, true)),
                         await tableMaterialMinimax(),
                         await singleTableMinimax(6,GetMonthRange(date, true)),
                         await doubleTableMinimax(6,6, Get2WeekRange(date, true) )
                    ],
                },
            ],
        });
    }
}

