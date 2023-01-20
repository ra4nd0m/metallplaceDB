const docx = require("docx");
const paragraph = require("./paragraph")
const {FontFamilyBold, FontFamilyExtraBold, h3Size, h3Color} = require("../const");

module.exports = function (text) {
    return paragraph({
        heading: docx.HeadingLevel.HEADING_3,
        alignment: docx.AlignmentType.LEFT,
        children: [
            new docx.TextRun({
                text: text,
                color: h3Color,
                font: FontFamilyBold,
                size: h3Size
            }),
        ]
    });
}

