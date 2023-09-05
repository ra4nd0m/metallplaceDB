const docx = require("docx");
module.exports = function shortReportChart(bytes){
    return new docx.ImageRun({
        alignment: docx.AlignmentType.CENTER,
        data: bytes,
        transformation: {
            width: 670,
            height: 670 / 2,
        }
    });
}