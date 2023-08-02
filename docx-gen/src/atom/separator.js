const docx = require("docx");
const paragraph = require("./paragraph");

module.exports = function () {

    return paragraph({
        spacing: {
            after: 140
        },
        children: [
            new docx.TextRun({
                text: "",
            }),
        ]
    });

}