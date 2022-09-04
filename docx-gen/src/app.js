const fs = require("fs");
const docx = require("docx");
const m = require('moment');

const footer = require("./component/footer");
const fetchChart = require("./client/chart");
const oneChart = require("./component/one_chart")
const twoChart = require("./component/two_chart")
const weekDates = getWeekDates()
const rusMonth = ["января","фервраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]
const footerTitle = `Отчетный период: ${weekDates.first.day} ${rusMonth[weekDates.first.month]} - `+
    `${weekDates.last.day} ${rusMonth[weekDates.last.month]} ${weekDates.last.year} года (${getWeekNumber()} неделя)`

async function genDocX() {
    return new docx.Document({
        sections: [
            {
                properties: {},
                footers: {
                    default: footer(footerTitle),
                },
                children: [
                    new docx.Paragraph({
                        children: [
                            await twoChart(
                            'http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png',
                            'http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png',)
                        ]
                    }),
                    new docx.Paragraph({
                        spacing: {before: 2000},
                        children: [await oneChart('http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png'), new docx.PageBreak()]
                    }),
                    new docx.Paragraph("Second Page"),
                ],
            },
        ],
    });
}

function getWeekDates(){
        const firstDay = m().startOf("isoWeek").toDate();
        const lastDay = m().endOf("isoWeek").toDate();

    return {
        first: {
            day: firstDay.getDate(),
            month: firstDay.getMonth(),
            year: firstDay.getFullYear()
        },
        last: {
            day: lastDay.getDate(),
            month: lastDay.getMonth(),
            year: lastDay.getFullYear()
        }
    }
}

function getWeekNumber(){
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);

}

genDocX().then(doc => {
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("MyDocument.docx", buffer);
    });
})

