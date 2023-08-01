const docx = require("docx");
const paragraph = require("./paragraph")
const {h2Size, FontFamilyExtraBold, h2Color, BordersNil, TableCellMarginNil, BorderNil, AccentColor, HeaderFooterMargin,

} = require("../const")

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
        borders: BordersNil,
        columnWidths: [1, 16, 5], // Set the second column width dynamically based on the title width
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