const docx = require("docx");
const axios = require('axios');

module.exports = async function fetchChart(url, isBig) {
        const res = await axios.get(url,  { responseType: 'arraybuffer' })
        const image = Buffer.from(res.data, "utf-8")
        let width = 300;
        let height = 150;
        if(isBig){
            width = 500;
            height = 250
        }
        return new docx.ImageRun({
            data: image,
            transformation: {
                width: width,
                height: height,
            },
        });
}