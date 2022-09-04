const docx = require("docx");
const axios = require('axios');

module.exports = async function fetchChart(url, width, height) {
        const res = await axios.get(url,  { responseType: 'arraybuffer' })
        const image = Buffer.from(res.data, "utf-8")
        return new docx.ImageRun({
            data: image,
            transformation: {
                width: width,
                height: height,
            },
        });
}