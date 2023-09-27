const docx = require("docx");
const chartBlock = require("./chart_block")
const paragraph = require("../atom/paragraph")
const {TableCellMarginNil, LineWidth, LineColor, FontFamily, FontSizeParagraph, FontFamilyExtraBold, FontFamilyMedium} = require("../const");
const margins = require("../atom/margins");

module.exports = async function oneChartText(url, titles){
    const block = await chartBlock(url, true)
    let titleBold
    let titleMedium
    if(titles !== undefined && titles.length === 2) {
        titleBold = titles[0]
        titleMedium = titles[1]
    }

    return margins([new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: docx.TableBorders.NONE,
        rows: [
            new docx.TableRow({
                children:[
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: titleBold + ", ",
                                        font: FontFamilyExtraBold,
                                        size: 12 * 2
                                    }),
                                    new docx.TextRun({
                                        text: titleMedium,
                                        font: FontFamilyMedium,
                                        size: 12 * 2
                                    })
                                ]
                            }),
                        ]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            block
                        ],
                    }),
                ],
            }),
        ],
    })
        ])
}