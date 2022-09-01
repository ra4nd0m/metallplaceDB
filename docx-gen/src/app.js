const fs = require("fs");
const docx = require("docx");
const axios = require('axios');
const imageSize = require('image-size');

async function fetchChart(url) {

    try {
        const res = await axios.get(url,  { responseType: 'arraybuffer' })
        const image = Buffer.from(res.data, "utf-8")
        const size = imageSize(image)
        return new docx.ImageRun({
            data: image,
            transformation: {
                width: size.width,
                height: size.height,
            },
        });
    } catch (e) {
        console.error(e);
    }
}

async function genDocX() {
    const image0 = await fetchChart('http://localhost:8080/getChart/2_2_11-01-2021_01-01-2022_0.png');

    return new docx.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [image0],
                    }),
                ],
            },
        ],
    });
}

function getWeek(){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();
}

genDocX().then(doc => {
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("MyDocument.docx", buffer);
    });
})

