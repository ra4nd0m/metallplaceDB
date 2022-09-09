const docx = require("docx");
const {FontFamily} = require("../const");

module.exports = function (v) {
    if (typeof v === 'string') {
        v = {children: [new docx.TextRun({text: v,  font: FontFamily})]}
    }
    return new docx.Paragraph(v);
}