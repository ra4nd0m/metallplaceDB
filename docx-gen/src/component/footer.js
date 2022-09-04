const docx = require("docx");
const {TextRun} = require("docx");

module.exports = function(title) {
    return new docx.Footer({
        children: [
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [5, 1],
                borders: docx.TableBorders.NONE,
                rows: [
                    new docx.TableRow({

                        children: [
                            new docx.TableCell({
                                children: [new docx.Paragraph(title)],
                            }),
                            new docx.TableCell({
                                children: [
                                    new docx.Paragraph(
                                    {
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({
                                                children: ["Страница | ", docx.PageNumber.CURRENT],
                                            }),
                                        ],
                                    }
                                    ),
                                ],
                            }),
                        ],
                    }),
                ],
            })
        ],
    });
}