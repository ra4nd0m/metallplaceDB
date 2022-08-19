import {ChartConfiguration} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const express = require('express')
const fs = require('fs');
const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const app = express()
const port = 3000

const chartJsFactory = () => {
    const Chart = require('chart.js');
    require('chartjs-plugin-datalabels');
    delete require.cache[require.resolve('chart.js')];
    delete require.cache[require.resolve('chartjs-plugin-datalabels')];
    return Chart;
}


type Feed = {
    prices: Price[]
}
type Price = {
    date: string,
    value: number,
}

type Dataset = {
    label: string,
    data: number[],
    lineTension: number,
    fill: boolean,
    borderColor: string
}

const getChart = async (feedArray: Feed[], nameArray: string[]) => {
    const width = 700; //px
    const height = 300; //px
    const canvasRenderService = new ChartJSNodeCanvas({width, height, chartJsFactory});
    let dateArray: string[] = []
    let feeds: number[][] = [];
    let datasets: Dataset[] = [];

    // Date labels: X axis
    feedArray[0].prices.forEach(item => {
        dateArray.push(item.date)
    })

    // Price values: Y axis
    feedArray.forEach(feed => {
        let prices: number[] = [];
        feed.prices.forEach(price => {
            prices.push(price.value);
        })

        feeds.push(prices);
    })

    // Creating dataset lines: material - price feed
    let nameCnt = 0;
    feeds.forEach(feed => {
        console.log("Pushing ", nameArray[nameCnt])
        datasets.push({
            label: nameArray[nameCnt],
            data: feed,
            lineTension: 0.1,
            fill: false,
            borderColor: 'white'
        });
        nameCnt++;
    })

    // Cfg for drawing chart
    const configuration: ChartConfiguration = {
        type: 'line',
        plugins: [ChartDataLabels],
        data: {
            labels: dateArray,
            datasets: datasets,

        },
        options: {
            plugins: {
                datalabels: {
                    borderRadius: 4,
                    color: 'white',
                    anchor: 'end',
                    align: 'top',
                    formatter: Math.round
                }
            }
        }
    };

    const imageBuffer = await canvasRenderService.renderToBuffer(configuration);

    //console.log(imageBuffer.toString('base64'))
    fs.writeFileSync('mychart.png', imageBuffer);
}

// app.get('/get', (req: Request , res: Response) => {
//
//     res.send(getChart())
// })
//
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
//

let json =
    [
        {
            "date": "01.01.2000",
            "value": 12
        },
        {
            "date": "02.01.2000",
            "value": 14
        },
        {
            "date": "03.01.2000",
            "value": 10
        },

        {
            "date": "04.01.2000",
            "value": 9
        },
        {
            "date": "05.01.2000",
            "value": 12
        },
        {
            "date": "06.01.2000",
            "value": 11
        },
    ]

let json2 =
    [
        {
            "date": "01.01.2000",
            "value": 132
        },
        {
            "date": "02.01.2000",
            "value": 114
        },
        {
            "date": "03.01.2000",
            "value": 103
        },

        {
            "date": "04.01.2000",
            "value": 99
        },
        {
            "date": "05.01.2000",
            "value": 100
        },
        {
            "date": "06.01.2000",
            "value": 211
        },
    ]

const materials = ["Material1", "Material2"]

getChart([{prices: json}, {prices: json2}], materials).then(() => console.log("Complete"))