const fs = require("fs");
const docx = require("docx");
const WeeklyReport = require("./report/weekly_report");
const express = require('express')

let app = express()
const port = 3001

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json


new WeeklyReport().generate(new Date(Date.UTC(2022, 9-1, 16))).then(doc => {
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("MyDocument.docx", buffer);
    });
})

app.post("/gen", (req, res) => {
    const dateArr = req.body.date.split("-")
    const year = dateArr[0]
    const month = dateArr[1]
    const day = dateArr[2]

    if(req.dates.type === "weekly"){
        new WeeklyReport().generate(new Date(Date.UTC(year, month, day))).then(buf =>
            res.send(buf)
        )
            .catch(reason =>
                res.send(JSON.stringify(reason))
            )
    }
})

app.listen(port, () => {
    console.log(`Docx-gen listening on port ${port}`)
})

