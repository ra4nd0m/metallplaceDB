const docx = require("docx");
const paragraph = require("./paragraph")
const {FontFamilyBold, h3Size, h3Color,
    BordersNil,
    TableCellMarginNil,
    BorderNil,
    Grey,
    FontFamilyExtraBold,
    HeaderFooterMargin, AccentColor, h2Size, FatBorder
} = require("../const");

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
        columnWidths: [1, 8],
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
                                    new docx.Paragraph({
                                        heading: docx.HeadingLevel.HEADING_3,
                                        alignment: docx.AlignmentType.LEFT,
                                        spacing: {
                                            before: 140,
                                            after: 140
                                        },
                                        children: [
                                            new docx.TextRun({
                                                text: text,
                                                color: AccentColor,
                                                font: FontFamilyExtraBold,
                                                size: h3Size,
                                            }),
                                        ]
                                    })
                        ],
                        borders: {
                            top: BorderNil,
                            bottom: BorderNil,
                            left: BorderNil,
                            right: BorderNil,
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

