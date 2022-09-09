const fs = require("fs");
const docx = require("docx");
const WeeklyReport = require("./report/weekly_report");

new WeeklyReport().generate().then(doc => {
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("MyDocument.docx", buffer);
    });
})

