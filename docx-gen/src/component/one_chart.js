const docx = require("docx");
const chartBlock = require("./chart_block")

const {TableCellMarginNil} = require("../const");
module.exports = async function oneChart(url){
    const block = await chartBlock(url, false)
    return new docx.Table({
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
}