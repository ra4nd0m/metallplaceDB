const docx = require("docx");
const paragraph = require("./paragraph")
const {FontFamilySemiBold, FontFamilyExtraBold, h3Size} = require("../const");

module.exports = function (text) {
    return paragraph({
        heading: docx.HeadingLevel.HEADING_3,
        alignment: docx.AlignmentType.LEFT,
        children: [
            new docx.TextRun({
                text: text,
                color: '#8ab440',
                font: FontFamilySemiBold,
                size: h3Size
            }),
        ]
    });
}

