const docx = require("docx");
const paragraph = require("./paragraph")
const getStringLengthInMillimeters = require('../utils/get_string_length')

const {h2Size, FontFamilyExtraBold, BordersNil, TableCellMarginNil, BorderNil, AccentColor, HeaderFooterMargin,
    FirstLineLength,
    PageWidth,

} = require("../const")

module.exports = function (text) {
    let first = FirstLineLength
    let second = getStringLengthInMillimeters(text, 22, 96)
    let third = PageWidth - first - second
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
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [],
                        borders: {
                            top: BorderNil,
                            right: BorderNil,
                            left: BorderNil,
                            bottom: { style: docx.BorderStyle.SINGLE, size: h2Size * 4 / 2, color: AccentColor },
                        },
                    }),
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        rowSpan: 2,
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
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [],
                        borders: {
                            top: BorderNil,
                            right: BorderNil,
                            left: BorderNil,
                            bottom: { style: docx.BorderStyle.SINGLE, size: h2Size * 4 / 2, color: AccentColor },
                        },
                    }),
                ],
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [],
                        borders: {
                            top: { style: docx.BorderStyle.SINGLE, size: h2Size * 4 / 2, color: AccentColor },
                            right: BorderNil,
                            left: BorderNil,
                            bottom: BorderNil,
                        },
                    }),
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [],
                        borders: {
                            top: { style: docx.BorderStyle.SINGLE, size: h2Size * 4 / 2, color: AccentColor },
                            right: BorderNil,
                            left: BorderNil,
                            bottom: BorderNil,
                        },
                    }),
                ],
            }),
        ],
    })

}