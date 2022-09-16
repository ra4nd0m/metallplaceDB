const docx = require("docx");
const {FontFamily} = require("../const");

module.exports = function (v, color) {
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: FontFamily, color: color})]
    });
}