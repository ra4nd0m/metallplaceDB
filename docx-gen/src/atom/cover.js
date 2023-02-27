const paragraph = require("../atom/paragraph");
const docx = require("docx");
const fs = require("fs");

module.exports = function (type) {
    let coverPath = "./src/static/cover_weekly.png"
    if (type === "monthly") {
        coverPath = "./src/static/cover_monthly.jpg"
    }
    return paragraph({
        children: [
            new docx.ImageRun({
                data: fs.readFileSync(coverPath),
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