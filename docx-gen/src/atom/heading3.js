const docx = require("docx");
const paragraph = require("./paragraph")
const {CurrentHeading3} = require("../const");

module.exports = function (text) {

    return paragraph({
        text: text,
        heading: docx.HeadingLevel.HEADING_3,
        alignment: docx.AlignmentType.LEFT,
    });
}

