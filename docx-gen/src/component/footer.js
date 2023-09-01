const docx = require("docx");
const {TextRun} = require("docx");
const paragraph = require("../atom/paragraph")
const {FontFamily, SideMargin, HeaderFooterMargin, BordersNil} = require("../const");
const margins = require("../atom/margins");

module.exports = function(title) {
    return new docx.Footer({
        children: [
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                columnWidths: [25, 6],
                borders: BordersNil,
                margins:{
                    left: SideMargin,
                    right: SideMargin,
                },
                rows: [
                    new docx.TableRow({
                        children: [
                            new docx.TableCell({
                                borders: BordersNil,
                                children: [
                                    paragraph({
                                        alignment: docx.AlignmentType.JUSTIFIED,
                                        children: title,
                                        spacing: {
                                            before: HeaderFooterMargin,
                                        }
                                    })
                                ],
                            }),
                            new docx.TableCell({
                                borders: BordersNil,
                                children: [
                                    paragraph(
                                        {
                                            alignment: docx.AlignmentType.RIGHT,
                                            spacing: {
                                                before: HeaderFooterMargin
                                            },
                                            children: [
                                                new TextRun({
                                                    font: FontFamily,
                                                    children: [docx.PageNumber.CURRENT],
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