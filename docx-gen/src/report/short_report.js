const docx = require("docx");
const footer = require("../component/footer");
const header = require("../component/header");
const {ShortHeaderTitle, RusMonth, AccentColor, FontFamilyExtraBold, h2Size, RusMonthStraight} = require("../const");
const {GetDates} = require("../utils/date_operations");
const h2 = require("../atom/heading2");
const margins = require("../atom/margins")
const paragraph = require("../atom/paragraph");
const chart = require("../atom/short_report_chart");
const cover = require("../atom/cover");
const coverDates = require("../atom/cover_dates_short")
function getFooterTitle(date) {
    const monthDates = GetDates(new Date(date.substring(0, 10)), "month")
    return `Отчетный период: ${monthDates.first.day} - ` +
        `${monthDates.last.day} ${RusMonth[monthDates.last.month]} ${monthDates.last.year} года`
}
function getHeaderTitle(date, headerTitle) {
    if (headerTitle === undefined) {
        headerTitle = ShortHeaderTitle
    }
    const monthDates = GetDates(new Date(date.substring(0, 10)), "month")
    return headerTitle + `: итоги ${RusMonth[monthDates.last.month]} ${monthDates.last.year} года`
}

function getCoverTitle(date) {
    const monthDates = GetDates(new Date(date.substring(0, 10)), "month")
    return `Итоги ${RusMonth[monthDates.last.month]} ${monthDates.last.year} года`
}

module.exports = class ShortReport {
    async generate(req) {
        let body = []
        req.blocks.forEach(block => {
            body.push(h2(block.title))
            block.text.forEach(p => {
                body.push(margins([paragraph(p)]))
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
                            coverDates(getCoverTitle(req.date)),
                            cover(req.report_header),
                        ]
                    },
                    {
                        footers: {
                            default: footer(getFooterTitle(req.date)),
                        },
                        headers: {
                            default: header(getHeaderTitle(req.date, req.report_header)),
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
                        children: body
                    }
                ]
            }
        )
    }
}
