const docx = require("docx");
const paragraph = require("../atom/paragraph");
const lineCell = require("../atom/line_cell");
const getTextWidthInMm = require("../utils/get_text_width");
const { createCanvas, registerFont } = require('canvas');
const getStringLengthInMillimeters = require('../utils/get_string_length')
const { HeaderFontSize, FontFamily, HeaderFooterMargin, Grey, BordersNil, FontFamilyExtraBold, BorderNil, PageWidth,HeaderSideMargin,
    FirstLineLength, staticDir
} = require("../const");
const {readFileSync} = require("fs");


module.exports = function (title) {
    let fontSize = HeaderFontSize
    while (getTextWidthInMm(title, fontSize, FontFamilyExtraBold) > (PageWidth - FirstLineLength) * 0.9) {
        fontSize *= 0.95
    }
    let first = FirstLineLength
    let second = getTextWidthInMm(title, fontSize, FontFamilyExtraBold) * 1.1
    let third = PageWidth - first - second

    return new docx.Header({
        children: [
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                margins: {
                    left: 0,
                    right: 0,
                },
                columnWidths: [first, second, third],
                borders: BordersNil,
                rows: [
                    new docx.TableRow({
                        children: [
                            lineCell("/line_grey.png", 10, FirstLineLength * 4),
                            new docx.TableCell({
                                margins: {top: 0, left: HeaderSideMargin, bottom: 0, right: HeaderSideMargin, marginUnitType: docx.WidthType.DXA},
                                verticalAlign: docx.VerticalAlign.CENTER,
                                children: [
                                    new docx.Paragraph({
                                        alignment: docx.AlignmentType.LEFT,
                                        children: [
                                            new docx.TextRun({ text: title, font: FontFamilyExtraBold, size: fontSize, color: Grey }),
                                        ],
                                        spacing: {
                                            after: HeaderFooterMargin,
                                        },
                                    }),

                                ],
                                borders: BordersNil,
                            }),
                            lineCell("/line_grey.png", 10, 500),
                        ],
                    }),
                ],
            }),
        ],
    });
};