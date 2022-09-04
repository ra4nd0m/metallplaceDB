const docx = require("docx");
const {TextRun} = require("docx");
const chart = require("../client/chart");
const oneChart = require("./one_chart")
module.exports = function twoChart(url1, url2, width, height){
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: docx.TableBorders.NONE,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [
                            oneChart(url1, width, height)
                        ],
                    }),

                    new docx.TableCell({
                        children: [
                            oneChart(url2, width, height)
                        ],
                    }),

                ],
            }),


        ],
    })
}