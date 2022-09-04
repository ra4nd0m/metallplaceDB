const docx = require("docx");
const {TextRun} = require("docx");
const chart = require("../client/chart");

module.exports = function oneChart(url, width, height){
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: docx.TableBorders.NONE,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [
                            new docx.Paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        children: ["Последняя цена"],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new docx.TableCell({
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
                        children: [
                            new docx.Paragraph({
                                children: [chart(url, width, height)]
                            })
                        ],
                    }),
                ]
            })
        ],
    })
}