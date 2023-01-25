const docx = require("docx");
const paragraph = require("./paragraph")
const {FontFamilyBold, h3Size, h3Color} = require("../const");

module.exports = function (text) {
    return new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_3,
        alignment: docx.AlignmentType.LEFT,
        spacing: {
            after: 140
        },
        children: [
            new docx.TextRun({
                text: text,
                color: h3Color,
                font: FontFamilyBold,
                size: h3Size,
            }),
        ]
    });
}

