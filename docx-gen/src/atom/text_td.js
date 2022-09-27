const docx = require("docx");
const {FontFamily, FontSizeTd} = require("../const");

module.exports = function (v, color){
    if (!isNaN(v) && v.toString().indexOf('.') !== -1) v = v.toString().replace(".", ",")
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: FontFamily, color: color, size: FontSizeTd})]
    });
}