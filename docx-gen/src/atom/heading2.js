const docx = require("docx");
const paragraph = require("./paragraph")
const {h2Size, FontFamilyExtraBold, h2Color} = require("../const")

module.exports = function (text) {
    return paragraph({
        heading: docx.HeadingLevel.HEADING_2,
        alignment: docx.AlignmentType.LEFT,
        children: [
            new docx.TextRun({
                text: text,
                color: h2Color,
                font: FontFamilyExtraBold,
                size: h2Size
            }),
        ]
    });
}