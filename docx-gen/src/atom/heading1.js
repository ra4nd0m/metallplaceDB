const docx = require("docx");
const paragraph = require("./paragraph")
const {BordersNil, TableCellMarginNil, BorderNil, Grey, FontFamilyExtraBold, HeaderFooterMargin, HeaderSideMargin} = require("../const");

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
        columnWidths: [1, 4, 5], // Set the second column width dynamically based on the title width
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
                            bottom: { style: docx.BorderStyle.SINGLE, size: 12 * 2, color: Grey },
                        },
                    }),
                    new docx.TableCell({
                        margins: {top: 0, left: HeaderSideMargin, bottom: 0, right: HeaderSideMargin, marginUnitType: docx.WidthType.DXA},
                        rowSpan: 2,
                        verticalAlign: docx.VerticalAlign.CENTER,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.JUSTIFIED,
                                children: [
                                    paragraph({
                                        text: text,
                                        heading: docx.HeadingLevel.HEADING_1,
                                        alignment: docx.AlignmentType.CENTER,
                                    })
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
                            bottom: { style: docx.BorderStyle.SINGLE, size: 12 * 2, color: Grey },
                        },
                    }),
                ],
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [],
                        borders: BordersNil,
                    }),
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [],
                        borders: BordersNil,
                    }),
                ],
            }),
        ],
    })

}