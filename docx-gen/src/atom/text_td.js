const docx = require("docx");
const {FontFamily, FontSizeTd} = require("../const");
const formatNum = require("../utils/numbers_format")

module.exports = function (v, color, fixed){
    v = formatNum(v, fixed)
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: FontFamily, color: color, size: FontSizeTd})]
    });
}