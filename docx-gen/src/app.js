const docx = require("docx");
const WeeklyReport = require("./report/weekly_report");
const express = require('express')

let app = express()
const port = 3001
app.use(express.json());

app.post("/gen", (req, res) => {
    const dateStr = req.body.date
    const dateArr = dateStr.split("-")
    const year = dateArr[0]
    const month = dateArr[1]
    const day = dateArr[2]

    switch (req.body.report_type) {
        case "weekly":
            console.log("Generating weekly report...")
            console.log(req.body.date + " + " + req.body.report_type)
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            new WeeklyReport().generate(new Date(Date.UTC(year, month-1, day))).then(doc =>
                docx.Packer.toBuffer(doc).then(buf => {
                    res.send(buf)
                })
            )
                .catch(reason =>
                    res.send(JSON.stringify(reason))
                )
            break
        default:
            res.send(JSON.stringify("Invalid report type"))
    }
})

app.listen(port, () => {
    console.log(`Docx-gen listening on port ${port}`)
})

