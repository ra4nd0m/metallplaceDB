const docx = require("docx");
const paragraph = require("../atom/paragraph")
const {TableCellMarginNil} = require("../const");

module.exports = function (title){
    return new docx.Header({
        children: [
            new docx.Table({
                width: {
                    size: 100,
                    type: docx.WidthType.PERCENTAGE,
                },
                borders: {
                    top: {size: 0},
                    right: {size: 0},
                    left: {size: 0},
                    bottom: {style: docx.BorderStyle.DASHED, size: 20, color: "d3d3d3"},
                },
                rows: [
                    new docx.TableRow({
                        children: [
                            new docx.TableCell({
                                margins: TableCellMarginNil,
                                children: [paragraph(title)],
                                borders: {
                                    top: {size: 0},
                                    right: {size: 0},
                                    left: {size: 0},
                                    bottom: {style: docx.BorderStyle.DASHED, size: 20, color: "d3d3d3"},
                                },
                            })
                        ],

                    })
                ]
            }),
        ],
    });
}
