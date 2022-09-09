const docx = require("docx");
const {FontFamily} = require("../const");


module.exports = function (v) {

    return new docx.TextRun({text: v, font: FontFamily});
}