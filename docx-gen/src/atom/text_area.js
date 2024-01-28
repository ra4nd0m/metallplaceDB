const docx = require("docx");
const margins = require("../atom/margins");
const {FontFamilyMedium} = require("../const");
module.exports = function(){
    let paragraph = new docx.Paragraph({
        alignment: docx.AlignmentType.BOTH,
        children: [new docx.TextRun({text: " ",  font: FontFamilyMedium, size: 11*2})]
    })

    return margins([paragraph])
}