const docx = require("docx");
const {FontFamily, FontSizeTd, FontFamilySemiBold} = require("../const");
const formatNum = require("../utils/numbers_format")

module.exports = function (v, color, fixed, len, i){
    v = formatNum(v, fixed)
    if(len === 5){
        // last row semi-bold in single table
        if (i === 4){
            return new docx.Paragraph({
                alignment: docx.AlignmentType.CENTER,
                children: [new docx.TextRun({text: v,  font: FontFamilySemiBold, color: color, size: FontSizeTd})]
            });
        }
        return new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            children: [new docx.TextRun({text: v,  font: FontFamily, color: color, size: FontSizeTd})]
        });
    }
    if(len === 10 || len === 9 || len === 8){
        // first 5 rows regular, last 5 semibold
        if (i > 4){
            return new docx.Paragraph({
                alignment: docx.AlignmentType.CENTER,
                children: [new docx.TextRun({text: v,  font: FontFamilySemiBold, color: color, size: FontSizeTd})]
            });
        }
        return new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            children: [new docx.TextRun({text: v,  font: FontFamily, color: color, size: FontSizeTd})]
        });
    }
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: FontFamily, color: color, size: FontSizeTd})]
    });
}