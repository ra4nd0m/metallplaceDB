const docx = require("docx");
const {FontFamilySemiBold, h3Size} = require("../const");
const paragraph = require("./paragraph");

    module.exports = function (text) {

        return paragraph({
            alignment: docx.AlignmentType.JUSTIFIED,
            children: [
                new docx.TextRun({
                    text: text,
                    color: '#8ab440',
                    font: FontFamilySemiBold,
                    size: h3Size
                }),
            ]
        });

}