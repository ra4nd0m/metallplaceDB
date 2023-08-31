const docx = require("docx");
const paragraph = require("./paragraph")
const getStringLengthInMillimeters = require('../utils/get_string_length')

const {h3Size, FontFamilyExtraBold, BordersNil, TableCellMarginNil, BorderNil, AccentColor, HeaderFooterMargin,
    FirstLineLength,
    PageWidth, HeaderSideMargin,

} = require("../const")
const getTextWidthInMm = require("../utils/get_text_width");
const lineCell = require("./line_cell");

module.exports = function (text) {
    let first = FirstLineLength
    let second = PageWidth - FirstLineLength
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
        columnWidths: [first, second],
        rows: [
            new docx.TableRow({
                children: [
                    lineCell("/line_orange.png", h3Size/2, FirstLineLength * 4),
                    new docx.TableCell({
                        margins: {top: 0, left: HeaderSideMargin, bottom: 0, right: HeaderSideMargin, marginUnitType: docx.WidthType.DXA},
                        verticalAlign: docx.VerticalAlign.CENTER,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.LEFT,
                                children: [
                                    new docx.TextRun({
                                        text: text,
                                        color: AccentColor,
                                        font: FontFamilyExtraBold,
                                        size: h3Size
                                    }),
                                ],
                                spacing: {
                                    after: HeaderFooterMargin,
                                },
                            }),
                        ],
                        borders: BordersNil,
                    }),
                ],
            }),

        ],
    })

}