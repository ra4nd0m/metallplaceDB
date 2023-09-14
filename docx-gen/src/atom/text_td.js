const docx = require("docx");
const {FontFamily, FontSizeTd, FontFamilySemiBold} = require("../const");
const formatNum = require("../utils/numbers_format")

module.exports = function (v, color, fixed, font, size){
    v = formatNum(v, fixed)
    if (font === undefined) font = FontFamily
    if (size === undefined) size = FontSizeTd
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: font, color: color, size: size})]
    });
}