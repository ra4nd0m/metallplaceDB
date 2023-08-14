const docx = require("docx");
const {BordersNil, TableNoOuterBorders} = require("../const");
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
                            left: 900,
                            right: 900,
                        },
                        children: v
                    })
                ]
            })
        ]
    })
}