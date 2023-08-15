const docx = require("docx");
const {FontFamilyBold, h3Size, h3Color, BordersNil, TableCellMarginNil, BorderNil, AccentColor, FontFamilyExtraBold,
    h2Size, FirstLineLength, PageWidth
} = require("../const");
const paragraph = require("./paragraph");
const getStringLengthInMillimeters = require("../utils/get_string_length");

    module.exports = function (text) {
        let first = FirstLineLength
        let second = PageWidth - first
        return new docx.Table({
            width: {
                size: 100,
                type: docx.WidthType.PERCENTAGE,
            },
            margins: {
                left: 0,
                right: 0,
            },
            columnWidths: [first, second], // Set the second column width dynamically based on the title width
            rows: [
                new docx.TableRow({
                    children: [
                        new docx.TableCell({
                            margins: TableCellMarginNil,
                            children: [],
                            borders: {
                                top: BorderNil,
                                bottom: { style: docx.BorderStyle.SINGLE, size: h3Size * 4 / 2, color: AccentColor },
                                left: BorderNil,
                                right: BorderNil,
                            },
                        }),
                        new docx.TableCell({
                            margins: TableCellMarginNil,
                            rowSpan: 2,
                            verticalAlign: docx.VerticalAlign.CENTER,
                            children: [
                                paragraph({
                                    alignment: docx.AlignmentType.LEFT,
                                    spacing: {
                                        after: 140
                                    },
                                    children: [
                                        new docx.TextRun({
                                            text: text,
                                            color: AccentColor,
                                            font: FontFamilyExtraBold,
                                            size: h3Size
                                        }),
                                    ]
                                })
                            ],
                            borders: BordersNil
                        }),
                    ],
                }),
                new docx.TableRow({
                    children: [
                        new docx.TableCell({
                            margins: TableCellMarginNil,
                            children: [],
                            borders: {
                                top: { style: docx.BorderStyle.SINGLE, size: h3Size * 4 / 2, color: AccentColor },
                                bottom: BorderNil,
                                left: BorderNil,
                                right: BorderNil,
                            },
                        }),

                    ],
                }),
            ],
        })




}