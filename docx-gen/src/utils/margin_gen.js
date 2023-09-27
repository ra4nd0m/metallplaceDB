const paragraph = require("../atom/paragraph");
const docx = require("docx");

module.exports = function (nLines) {
    let lines = []
    for (let i = 0; i < nLines; i++) {
        lines.push(paragraph({children: [new docx.TextRun({text: " "})]}))
    }
    return lines
}