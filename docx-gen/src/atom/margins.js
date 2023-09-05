const docx = require("docx");
const {SideMargin, TableNoOuterBorders} = require("../const");
module.exports = function(v) {
    return new docx.Table({
        columnWidths: [1],
        width: {
            type: docx.WidthType.PERCENTAGE,
            size: 100
        },
        borders: TableNoOuterBorders,
        rows: [
            new docx.TableRow({

                children: [
                    new docx.TableCell({
                        borders: TableNoOuterBorders,
                        margins: {
                            left: SideMargin,
                            right: SideMargin,
                        },
                        children: v
                    })
                ]
            })
        ]
    })
}