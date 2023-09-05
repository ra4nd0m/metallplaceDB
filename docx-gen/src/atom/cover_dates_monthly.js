const docx = require("docx");
const {TableCellMarginNil, FontFamilySemiBold, FontSizeCoverPrimary, FontFamilyMedium, FontFamilyLight, AccentColor,AccentColor2,
    FontFamilyThin
} = require("../const");
const paragraph = require("../atom/paragraph");
const text = require("../atom/text");

module.exports = function (month, year) {
    return new docx.Table({
        borders: {
            top: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            bottom: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            left: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            right: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
        },
        float: {
            absoluteVerticalPosition: 660 * 20,
            absoluteHorizontalPosition: 65 * 20,
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
                                alignment: docx.AlignmentType.LEFT,
                                spacing: {before: 0},
                                children: [
                                    text({
                                        text: month,
                                        font: FontFamilySemiBold,
                                        size: FontSizeCoverPrimary,
                                        color: AccentColor
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
                                alignment: docx.AlignmentType.LEFT,
                                spacing: {before: 0},
                                children: [
                                    text({
                                        text: year,
                                        font: FontFamilyLight,
                                        size: FontSizeCoverPrimary,
                                        color: AccentColor2
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