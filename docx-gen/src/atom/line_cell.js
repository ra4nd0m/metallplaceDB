const docx = require("docx");
const {TableCellMarginNil, staticDir, BordersNil} = require("../const");
const paragraph = require("./paragraph");
const {readFileSync} = require("fs");
module.exports = function (file, height, width) {
    return new docx.TableCell({
        margins: TableCellMarginNil,
        verticalAlign: docx.VerticalAlign.CENTER,
        children: [
            paragraph({
                verticalAlign: docx.VerticalAlign.CENTER,
                children: [
                    new docx.ImageRun({
                        data: readFileSync(staticDir + file),
                        transformation: {
                            width: width,
                            height: height,
                        },
                    })
                ],

            }),

        ],
        borders: BordersNil
    })
}