const docx = require("docx");
const {TableCellMarginNil, FontFamilySemiBold, FontSizeCoverPrimary, FontFamilyMedium, AccentColor,
    FontSizeCoverSecondary, FontFamilyLight, FontFamilyThin
} = require("../const");
const paragraph = require("../atom/paragraph");
const text = require("../atom/text");

module.exports = function (weekNum, dates, year) {
    return new docx.Table({
        borders: {
            top: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            bottom: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            left: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
            right: {style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF"},
        },
        float: {
            absoluteVerticalPosition: 13000,
            absoluteHorizontalPosition: 2000,
        },
        width: {
            size: 70,
            type: docx.WidthType.PERCENTAGE,
        },
        rows: [
            row(weekNum, FontFamilySemiBold, FontSizeCoverPrimary),
            row(dates, FontFamilyMedium, FontSizeCoverSecondary),
            row(year, FontFamilyThin, FontSizeCoverPrimary),
        ]
    })
}

function row(content, font, size) {
    return new docx.TableRow({
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
                                text: content,
                                color: AccentColor,
                                font: font,
                                size: size,
                            }),
                        ],
                    }),
                ],
            }),
        ]
    })
}