const docx = require("docx");
const paragraph = require("./paragraph")
const getStringLengthInMillimeters = require('../utils/get_string_length')

const {h2Size, FontFamilyExtraBold, BordersNil, TableCellMarginNil, BorderNil, AccentColor, HeaderFooterMargin,
    FirstLineLength,
    PageWidth,

} = require("../const")
const getTextWidthInMm = require("../utils/get_text_width");
const lineCell = require("./line_cell");

module.exports = function (text) {
    let first = FirstLineLength
    let second = getTextWidthInMm(text,h2Size, FontFamilyExtraBold)
    let third = PageWidth - first - second
    if (third < 0) third = 0
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        margins: {
            left: 0,
            right: 0,
        },
        borders: BordersNil,
        columnWidths: [first, second, third],
        rows: [
            new docx.TableRow({
                children: [
                    lineCell("/line_orange.png", 20, FirstLineLength * 4),
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        verticalAlign: docx.VerticalAlign.CENTER,
                        children: [
                                    paragraph({
                                        heading: docx.HeadingLevel.HEADING_2,
                                        alignment: docx.AlignmentType.LEFT,
                                        children: [
                                            new docx.TextRun({
                                                text: text,
                                                color: AccentColor,
                                                font: FontFamilyExtraBold,
                                                size: h2Size
                                            }),
                                ],
                                spacing: {
                                    after: HeaderFooterMargin,
                                },
                            }),
                        ],
                        borders: BordersNil,
                    }),
                    lineCell("/line_orange.png", 20, 500),
                ],
            }),

        ],
    })

}