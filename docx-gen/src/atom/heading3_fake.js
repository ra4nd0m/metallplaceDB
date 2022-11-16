const docx = require("docx");
const {FontSizeHeading3, FontFamily, HeadingColor} = require("../const");
const paragraph = require("./paragraph");

    module.exports = function (v) {

        return paragraph({
            alignment: docx.AlignmentType.JUSTIFIED,
            children: [new docx.TextRun({text: v, font: FontFamily, size: FontSizeHeading3, color: HeadingColor})]
        });

}