const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const {ShortHeaderTitle, RusMonth} = require("../const");
const {GetDates} = require("../utils/date_operations");
const h2 = require("../atom/heading2");
const paragraph = require("../atom/paragraph");
const chart = require("../atom/short_report_chart");

function getFooterTitle(date) {
    const weekDates = GetDates(date, "month")
    return `Отчетный период: ${weekDates.first.day} ${RusMonth[weekDates.first.month]} - ` +
        `${weekDates.last.day} ${RusMonth[weekDates.last.month]} ${weekDates.last.year} года`
}

module.exports = class ShortReport {
    async generate(req) {
        let body = [
            new docx.TableOfContents("Содержание", {
                hyperlink: true,
                headingStyleRange: "1-5",
            }),
        ]
        req.blocks.forEach(block => {
            body.push(h2(block.title))
            block.text.forEach(p => {
                body.push(paragraph(p))
                body.push(paragraph(" "))
            })
            if (block.chart !== null) {
                body.push(
                    paragraph({
                        alignment: docx.AlignmentType.CENTER,
                        children: [
                            chart(block.chart)
                        ]
                    })
                )
            }
        })
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
                                children: []
                            }),
                        ]
                    },
                    {
                        //footers: {
                        //    default: footer(getFooterTitle(req.date)),
                        //},
                        headers: {
                            default: header(ShortHeaderTitle)
                        },
                        properties: {
                            page: {
                                margin: {
                                    right: 800,
                                    left: 800,
                                },
                            },
                        },
                        children: body
                    }
                ]
            }
        )
    }
}
