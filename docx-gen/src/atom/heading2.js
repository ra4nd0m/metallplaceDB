const docx = require("docx");
const paragraph = require("./paragraph")
const {h2Size, FontFamilyExtraBold, FontFamily} = require("../const")

module.exports = function (text) {
    return paragraph({
        heading: docx.HeadingLevel.HEADING_2,
        font: FontFamily,
        alignment: docx.AlignmentType.LEFT,
        children: [
            new docx.TextRun({
                text: text,
                font: FontFamilyExtraBold,
                size: h2Size
            }),
        ]
    });
}