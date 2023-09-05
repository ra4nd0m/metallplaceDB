const docx = require("docx");
module.exports = function() {
    return new docx.Paragraph({children: [new docx.PageBreak()]})
}