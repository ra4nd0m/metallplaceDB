const docx = require("docx");
const {FontFamily} = require("../const");

module.exports = function (v, font, size){
    if (font === undefined) font = FontFamily
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: font, size: size})]
    });
}