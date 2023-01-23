const docx = require("docx");
const {TableCellMarginNil, FontFamilySemiBold, FontSizeCover, FontFamilyMedium} = require("../const");
const paragraph = require("../atom/paragraph");
const text = require("../atom/text");

module.exports = function (line1, line2) {
    return new docx.Table({
        borders: {
            top: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            bottom: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            left: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            right: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
        },
        float: {
            absoluteVerticalPosition: 13200,
            absoluteHorizontalPosition: 2100,
        },
        width: {
            size: 70,
            type: docx.WidthType.PERCENTAGE,
        },
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        borders: {
                            top: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                            bottom: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                            left: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                            right: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                        },
                        margins: TableCellMarginNil,
                        verticalAlign: docx.VerticalAlign.CENTER,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                spacing: {before: 0},
                                children: [
                                    text({
                                        text: line1,
                                        font: FontFamilySemiBold,
                                        size: FontSizeCover,
                                    }),
                                ],
                            }),

                        ],
                    }),
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        borders: {
                            top: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                            bottom: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                            left: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                            right: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
                        },
                        margins: TableCellMarginNil,
                        verticalAlign: docx.VerticalAlign.CENTER,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                spacing: {before: 0},
                                children: [
                                    text({
                                        text: line2,
                                        font: FontFamilyMedium,
                                        size: FontSizeCover * 0.8
                                    })
                                ],
                            }),
                        ],
                    }),
                ]
            }),
        ]
    })
}