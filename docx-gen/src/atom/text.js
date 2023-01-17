const docx = require("docx");
const {FontFamily} = require("../const");


module.exports = function (v) {
    if (typeof v === "string") return new docx.TextRun({text: v, font: FontFamily})
    return new docx.TextRun(v)
}