const docx = require("docx");
const chartBlock = require("./chart_block")

const {TableCellMarginNil} = require("../const");
const margins = require("../atom/margins");
module.exports = async function oneChart(url, avgGroup, comparePeriod, fixed, fixedChange){
    if (fixed === undefined) {
        fixed = 0
    }
    if (fixedChange === undefined) {
        fixedChange = 1
    }
    if(avgGroup === undefined) avgGroup = 1
    const block = await chartBlock(url, false, avgGroup, comparePeriod, fixed, fixedChange)
    return margins([new docx.Table({
            width: {
                size: 100,
                type: docx.WidthType.PERCENTAGE,
            },
            columnWidths: [10.5 , 20, 10.5],
            borders: docx.TableBorders.NONE,
            rows: [
                new docx.TableRow({
                    children: [

                        new docx.TableCell({children: []}),
                        new docx.TableCell({
                            margins: TableCellMarginNil,
                            children: [
                                block
                            ],
                        }),
                        new docx.TableCell({children: []})
                    ],
                }),
            ],
        })
    ])
}