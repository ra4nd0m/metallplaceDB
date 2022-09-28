const docx = require("docx");
const {FontFamily, FontSizeTd} = require("../const");

module.exports = function (v, color){
    if (!isNaN(v)){
        if(v.toString().indexOf('.') !== -1){
            v = v.toString().replace(".", ",")
        }else {
            if(v >= 1000){
                const after = v.toString().slice(-3)
                const before = v.toString().slice(0, v.toString().length - 3)
                v = before + " " + after
            }
        }
    }
    return new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun({text: v,  font: FontFamily, color: color, size: FontSizeTd})]
    });
}