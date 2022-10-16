const docx = require("docx");
const {TextRun} = require("docx");
const paragraph = require("../atom/paragraph")
const {FontFamily, LineWidth, LineColor} = require("../const");

module.exports = function(title) {
    return new docx.Footer({
        children: [
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [5, 1],
                borders: {
                    top: {style: docx.BorderStyle.DASHED, size: LineWidth, color: LineColor},
                    right: {size: 0, color: "FFFFFF"},
                    left: {size: 0, color: "FFFFFF"},
                    bottom: {size: 0, color: "FFFFFF"},
                },
                rows: [
                    new docx.TableRow({
                        children: [
                            new docx.TableCell({
                                children: [paragraph(title)],
                            }),
                            new docx.TableCell({
                                children: [
                                    paragraph(
                                    {
                                        alignment: docx.AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({
                                                font: FontFamily,
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