const paragraph = require("../atom/paragraph");
const docx = require("docx");
const fs = require("fs");

module.exports = function () {
    return paragraph({
        children: [
            new docx.ImageRun({
                data: fs.readFileSync("./src/static/cover.png"),
                transformation: {
                    width: 795,
                    height: 1130,
                },
                floating: {
                    horizontalPosition: {
                        align: docx.HorizontalPositionAlign.LEFT
                    },
                    verticalPosition: {
                        align: docx.VerticalPositionAlign.CENTER
                    },
                    allowOverLap: true,
                    zIndex: 0,
                    behindDocument: true
                }
            }),
        ]
    })
}