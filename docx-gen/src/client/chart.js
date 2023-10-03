const docx = require("docx");
const axios = require('axios');

module.exports = async function fetchChart(url, isBig) {
        const res = await axios.get(url,  { responseType: 'arraybuffer' })
        const image = Buffer.from(res.data, "utf-8")
        let width = 320;
        let height = width / 2;
        if(isBig){
            width = 660;
            height = width / 2.5
        }
        return new docx.ImageRun({
            data: image,
            transformation: {
                width: width,
                height: height,
            },
        });
}