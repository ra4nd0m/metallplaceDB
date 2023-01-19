const docx = require("docx");
const {FontFamily, FontSizeTdMicro} = require("../const");

module.exports = function (v, color, font, size){
    if (font === undefined) font = FontFamily
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: font, color: color, size: size, italics: true})]
    });
}