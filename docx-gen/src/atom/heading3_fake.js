const docx = require("docx");
const {FontFamilyBold, h3Size, h3Color, BordersNil, TableCellMarginNil, BorderNil, AccentColor, FontFamilyExtraBold,
    h2Size
} = require("../const");
const paragraph = require("./paragraph");

    module.exports = function (text) {
        return new docx.Table({
            width: {
                size: 100,
                type: docx.WidthType.PERCENTAGE,
            },
            margins: {
                left: 0,
                right: 0,
            },
            columnWidths: [1, 4], // Set the second column width dynamically based on the title width
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