const docx = require("docx");
const chartBlock = require("./chart_block")
const paragraph = require("../atom/paragraph")

const {TableCellMarginNil, LineWidth, LineColor} = require("../const");
const {TextRun} = require("docx");
module.exports = async function oneChartText(url){
    const block = await chartBlock(url, true)

    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [29.5, 1, 10],
        borders: docx.TableBorders.NONE,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        borders: {right: {style: docx.BorderStyle.THICK, size: LineWidth / 2, color: LineColor}},
                        children: [
                            block
                        ],
                    }),
                    new docx.TableCell({
                        children: [],
                    }),
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.LEFT,
                                children: [
                                    new TextRun({
                                        children: ["Введите текст"],
                                    }),
                                ],
                            }),
                        ],
                    }),

                ],
            }),


        ],
    })
}