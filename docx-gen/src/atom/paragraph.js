const docx = require("docx");
const {FontFamily, PageMargins} = require("../const");

module.exports = function (v) {

    if (typeof v === 'string') {
        v = {
            alignment: docx.AlignmentType.JUSTIFIED,
            children: [
                new docx.TextRun({text: v,  font: FontFamily})
            ]
        }
    }
    // A Table passed as the sole child of a Paragraph produces invalid OOXML
    // (<w:tbl> inside <w:p>). Return the table directly instead.
    if (v && Array.isArray(v.children) && v.children.length === 1 && v.children[0] instanceof docx.Table) {
        return v.children[0];
    }
    return new docx.Paragraph(v);
}