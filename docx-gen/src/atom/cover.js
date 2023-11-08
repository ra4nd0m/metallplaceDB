const paragraph = require("../atom/paragraph");
const docx = require("docx");
const fs = require("fs");
const {staticDir} = require("../const");

module.exports = function (type) {
    let coverPath = staticDir + "/cover_weekly.png"
    if (type === "monthly") {
        coverPath = staticDir + "/cover_monthly.png"
    }
    if (type === "Мировой и российский рынок стали") {
        coverPath = staticDir + "/cover_short_steel.jpg"
    }
    if (type === "Мировой рынок металлургического сырья") {
        coverPath = staticDir + "/cover_short_raw_materials.jpg"
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