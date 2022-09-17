const docx = require("docx");
const {FontFamily, FontSizeTh} = require("../const");

module.exports = function (v){
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: FontFamily, size: FontSizeTh})]
    });
}