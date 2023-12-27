const docx = require("docx");
const chartBlock = require("./chart_block")

const {TableCellMarginNil} = require("../const");
const margins = require("../atom/margins");
module.exports = async function twoChart(url1, url2, avgGroup, comparePeriod, fixed){
    if(avgGroup === undefined) avgGroup = [1, 1]
    for (let i = 0; i < avgGroup.length; i++){
        if (avgGroup[i] === undefined) avgGroup[i] = 1
    }
    let fixed1 = -1
    let fixed2 = -1
    if (fixed !== undefined && fixed.length === 2 ) {
        fixed1 = fixed[0]
        fixed2 = fixed[1]
    }
    const block1 = await chartBlock(url1, false, avgGroup[0], comparePeriod, fixed1)
    const block2 = await chartBlock(url2, false, avgGroup[1], comparePeriod, fixed2)
    return margins([new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [20, 1, 20],
        borders: docx.TableBorders.NONE,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            block1
                        ],
                    }),
                    new docx.TableCell({children: []}),
                    new docx.TableCell({
                        margins: TableCellMarginNil,
                        children: [
                            block2
                        ],
                    }),
                ],
            }),
        ],
    })
        ])
}