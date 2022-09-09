const docx = require("docx");
const {TextRun} = require("docx");
const chart = require("../client/chart");
const paragraph = require("../atom/paragraph")
const text = require("../atom/text")
const {TableCellMarginNil} = require("../const");

module.exports = async function chartBlock(url, isBig) {
    const image = await chart(url, isBig);
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [3, 1],
        borders: docx.TableBorders.NONE,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                spacing: {before: 0},
                                children: [
                                    text("Последняя цена")
                                ],
                            }),
                        ],
                    }),

                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Изм. цены")],
                            }),
                        ],
                    }),

                ],
            }),

            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [image]
                            })
                        ],
                    }),
                ]
            })
        ],
    })
}