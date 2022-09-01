import {ChartConfiguration} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Request} from "express";
import {Response} from "express/ts4.0";
import {LabelOptions} from "chartjs-plugin-datalabels/types/options";

const express = require('express')
const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
let app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json


const chartJsFactory = () => {
    const Chart = require('chart.js');
    require('chartjs-plugin-datalabels');
    delete require.cache[require.resolve('chart.js')];
    delete require.cache[require.resolve('chartjs-plugin-datalabels')];
    return Chart;
}

type Dataset = {
    label: string,
    data: number[],
    lineTension: number,
    fill: boolean,
    borderColor: string
}

type YDataSet = {
    label: string,
    data: number[]
}

const getChart = async (XLabelSet: string[], YDataSets: YDataSet[], options: ChartOptions): Promise<Buffer> => {
    const width = 700; //px
    const height = 400; //px
    const canvasRenderService = new ChartJSNodeCanvas({width, height, chartJsFactory});
    let datasets: Dataset[] = [];

    // Creating dataset lines: material - price feed
    YDataSets.forEach(set => {
        console.log("Pushing ", set.label)
        datasets.push({
            label: set.label,
            data: set.data,
            lineTension: 0.1,
            fill: false,
            borderColor: 'rgb(55, 74, 116)',
        });
    })

    const configuration: ChartConfiguration = getChartConf(datasets, XLabelSet, options)
    return await canvasRenderService.renderToBuffer(configuration);
}

type ChartOptions = {
    labels?: Partial<LabelOptions>,
}

function getChartConf(datasets: Dataset[], dateArray: string[], options: ChartOptions): ChartConfiguration {
    const fontSize = 12
    const conf: ChartConfiguration = {
        type: 'line',
        plugins: [],
        data: {
            labels: dateArray,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    offset: true,
                    ticks: {
                        autoSkip: true,
                        maxRotation: 80,
                    }
                },
                y: {
                    offset: true,
                }
            },
            plugins: {},

        }
    }
    if (options.labels) {
        // @ts-ignore
        conf.plugins.push(ChartDataLabels)
        // @ts-ignore
        conf.options.plugins = {
            datalabels: {
                borderRadius: 4,
                backgroundColor: 'gray',
                color: 'white',
                anchor: 'end',
                align: 'top',
                textAlign: 'center',
                font: {
                    size: fontSize
                },
                clamp: true,
                ...options.labels,
            }
        }
    }
    return conf
}

app.get('/test', (req: Request , res: Response) => {
    getChart(xData, yData, {labels: {}})
        .then(buf => res.send(`<img src="data:image/png;base64, ${buf.toString('base64')}"\>`))
        .catch(reason => res.send(JSON.stringify(reason)))
})

app.post('/gen', (req: Request, res: Response) => {
    getChart(req.body.x_label_set, req.body.y_data_set, req.body.chart_options)
        .then(buf =>
            res.send(buf)
        )
        .catch(reason =>
            res.send(JSON.stringify(reason))
        )
})

 app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
 })

let yData: YDataSet[] = []
yData.push({label: "Сталь 1", data: [23, 54, 65, 75, 63]})
yData.push({label: "Сталь 2", data: [10, 23, 13, 18, 20]})
const xData = ["01-01-2000", "02-01-2000", "03-01-2000", "04-01-2000", "05-01-2000"]

