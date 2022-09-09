const docx = require("docx");
const paragraph = require("./paragraph")

module.exports = function (text) {
    return paragraph({
        text: text,
        heading: docx.HeadingLevel.HEADING_2,
        alignment: docx.AlignmentType.LEFT,
    });
}