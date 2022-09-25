const fs = require("fs");
const docx = require("docx");
const WeeklyReport = require("./report/weekly_report");

new WeeklyReport().generate(new Date(Date.UTC(2022, 8, 10))).then(doc => {
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("MyDocument.docx", buffer);
    });
})

