const docx = require("docx");
const {FontFamily, FontSizeTd, FontFamilySemiBold} = require("../const");
const formatNum = require("../utils/numbers_format")

module.exports = function (v, color, fixed, font){
    v = formatNum(v, fixed)
    if (font === undefined) font = FontFamily
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: font, color: color, size: FontSizeTd})]
    });
}