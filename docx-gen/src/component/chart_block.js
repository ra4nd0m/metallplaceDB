const docx = require("docx");
const {TextRun} = require("docx");
const chart = require("../client/chart");
const {TableCellMarginNil} = require("./const");

module.exports = async function chartBlock(url) {
    const image = await chart(url);
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
                            new docx.Paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                spacing: {before: 0},
                                children: [
                                    new TextRun({
                                        children: ["Последняя цена"],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            new docx.Paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        children: ["Изм. цены"],
                                    }),
                                ],
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
                            new docx.Paragraph({
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