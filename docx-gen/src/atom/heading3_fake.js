const docx = require("docx");
const {FontFamilyBold, h3Size, h3Color} = require("../const");
const paragraph = require("./paragraph");

    module.exports = function (text) {

        return paragraph({
            alignment: docx.AlignmentType.LEFT,
            spacing: {
                after: 140
            },
            children: [
                new docx.TextRun({
                    text: text,
                    color: h3Color,
                    font: FontFamilyBold,
                    size: h3Size
                }),
            ]
        });

}