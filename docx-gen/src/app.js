const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../../.env')})

const docx = require("docx");
const WeeklyReport = require("./report/weekly_report");
const MonthlyReport = require("./report/monthly_report")
const ShortReport = require("./report/short_report")
const express = require('express')

let bodyParser = require('body-parser');

let app = express()

const port = process.env.DOCXGEN_PORT
const host = process.env.DOCXGEN_HOST

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json());

app.post("/genShort", (req, res) => {
    console.log("gen short")
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    new ShortReport().generate(req.body).then(doc =>
        docx.Packer.toBuffer(doc).then(buf => {
            res.send(buf)
        })
    )
        .catch(reason =>
            res.send(JSON.stringify(reason))
        )

})

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
        case "monthly":
            console.log("Generating monthly report...")
            console.log(req.body.date + " + " + req.body.report_type)

            new MonthlyReport().generate(new Date(Date.UTC(year, month-1, day))).then(doc =>
                docx.Packer.toBuffer(doc).then(buf => {
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
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

app.listen(port, host, () => {
    console.log(`Docx-gen listening on port ${port}`)
})

