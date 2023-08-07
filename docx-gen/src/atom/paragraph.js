const docx = require("docx");
const {FontFamily, PageMargins} = require("../const");

module.exports = function (v) {

    if (typeof v === 'string') {
        v = {
            alignment: docx.AlignmentType.JUSTIFIED,
            children: [
                new docx.TextRun({text: v,  font: FontFamily})
            ]
        }
    }
    return new docx.Paragraph(v);
}