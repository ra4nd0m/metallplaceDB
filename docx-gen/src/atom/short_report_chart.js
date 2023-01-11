const docx = require("docx");
module.exports = function shortReportChart(bytes){
    return new docx.ImageRun({
        data: Buffer.from(bytes, "utf-8"),
        transformation: {
            width: 420,
            height: 210,
        },
    });
}