const docx = require("docx");
const paragraph = require("../atom/paragraph");
const getStringLengthInMillimeters = require('../utils/get_string_length')
const { TableCellMarginNil, FontFamily, HeaderFooterMargin, Grey, BordersNil, FontFamilyExtraBold, BorderNil, PageWidth,
    FirstLineLength
} = require("../const");


module.exports = function (title) {
    let first = FirstLineLength
    let second = getStringLengthInMillimeters(title, 22, 96)
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
                                    bottom: { style: docx.BorderStyle.SINGLE, size: 12 * 4, color: Grey },
                                },
                            }),
                            new docx.TableCell({
                                margins: TableCellMarginNil,
                                rowSpan: 2,
                                verticalAlign: docx.VerticalAlign.CENTER,
                                children: [
                                    paragraph({
                                        alignment: docx.AlignmentType.JUSTIFIED,
                                        children: [new docx.TextRun({ text: title, font: FontFamilyExtraBold, size: 12 * 2, color: Grey })],
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
                                    bottom: { style: docx.BorderStyle.SINGLE, size: 12 * 4, color: Grey },
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
                                    top: { style: docx.BorderStyle.SINGLE, size: 12 * 4, color: Grey },
                                    right: BorderNil,
                                    left: BorderNil,
                                    bottom: BorderNil,
                                },
                            }),
                            new docx.TableCell({
                                margins: TableCellMarginNil,
                                children: [],
                                borders: {
                                    top: { style: docx.BorderStyle.SINGLE, size: 12 * 4, color: Grey },
                                    right: BorderNil,
                                    left: BorderNil,
                                    bottom: BorderNil,
                                },
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};