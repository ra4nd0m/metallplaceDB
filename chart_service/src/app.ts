import {Chart, ChartConfiguration} from "chart.js";
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
    const width = 900; //px
    const height = 450; //px
    const canvasRenderService = new ChartJSNodeCanvas({width, height, chartJsFactory});
    let datasets: Dataset[] = [];
    let colors = ['rgb(55, 74, 116)', 'rgb(100, 70, 96)']
    let i = 0


    // Creating dataset lines: material - price feed
    YDataSets.forEach(set => {
        console.log("Pushing ", set.label)
        // @ts-ignore
        datasets.push({
            label: `${set.label}`,
            data: set.data,
            lineTension: 0.1,
            fill: false,
            borderColor: colors[i],
        });
        i++
    })
    Chart.defaults.font.size = 25;
    const configuration: ChartConfiguration = getChartConf(datasets, XLabelSet, options)
    return await canvasRenderService.renderToBuffer(configuration);
}

type ChartOptions = {
    labels?: Partial<LabelOptions>,
    type?: string,
}

function getChartConf(datasets: Dataset[], dateArray: string[], options: ChartOptions): ChartConfiguration {
    const labelFontSize = 17
    const legendFontSize = 20
    const axesFontSize = 25
    const pointRadius = 1
    const labelOffset = 5

    let dateArrayFormatted = []
    let legendBoxSize = 13
    for(let i = 0; i < dateArray.length; i++){
        if (options.labels){
            dateArrayFormatted.push(formatXLabel(dateArray[i], false))
        } else{
            legendBoxSize = 0
            dateArrayFormatted.push(formatXLabel(dateArray[i], true))
        }
    }
    const conf: ChartConfiguration = {
        type: 'line',
        plugins: [],
        data: {
            labels: dateArrayFormatted,
            datasets: datasets,
        },
        options: {
            locale: "",
            elements: {
                point: {
                    radius : pointRadius
                }
            },
            scales: {
                x: {
                    offset: true,
                    ticks: {
                        font: { size: axesFontSize },
                        includeBounds: true,
                        maxRotation: 45,
                        maxTicksLimit: 20,
                        autoSkip: true
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    offset: true,
                    ticks: {
                        font: { size: axesFontSize },
                        maxTicksLimit: 8,
                        maxRotation: 0,
                        callback: (value, index, values) => {
                            return formatYLabel(Number(value))
                        },
                    },
                }
            },

            plugins: {
                legend: {
                    display: false,
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: legendFontSize
                        },
                        boxWidth: legendBoxSize,
                        boxHeight: legendBoxSize,
                    }
                }
            },
        },
    }

    if (options.labels) {
        // @ts-ignore
        conf.options?.plugins?.legend?.display = true
        // @ts-ignore
        conf.plugins.push(ChartDataLabels)
        // @ts-ignore
        conf.options.plugins = {
            ...conf.options?.plugins,
             datalabels: {
                 offset: labelOffset,
                 borderRadius: 4,
                 backgroundColor: 'gray',
                 color: 'white',
                 anchor: 'end',
                 formatter: function(value, context) {
                     return formatYLabel(value);
                 },
                 align: 'top',
                 textAlign: 'center',
                 font: {
                     size: labelFontSize
                 },
                 clamp: true,

                 ...options.labels,
             }
        }
        // @ts-ignore
        conf.options.elements.point.radius = 0
    }
    if(options.type == 'bar'){
        conf.data.datasets.push(
            {
                type: 'bar',
                label: '',
                data: datasets[0].data,
                borderColor: 'rgb(55, 74, 116)',
                datalabels: {
                    display: false,
                }
            },
        )
    }
    return conf
}

function formatXLabel(date: string, ifWeek: boolean): string {
    const dateArr = date.split("-")
    if (!ifWeek) {
        return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`
    }
    let cur = new Date(Date.UTC(Number(dateArr[0]), Number(dateArr[1]) - 1, Number(dateArr[2])));
    let oneJan = new Date(cur.getFullYear(), 0, 1);
    let numberOfDays = Math.floor((cur.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    let week = Math.ceil((cur.getDay() + 1 + numberOfDays) / 7);
    return `${week} (${dateArr[0]})`
}

function formatYLabel(num: number){
    let numStr = num.toString()
    if(num >= 1000){
        const after = num.toString().slice(-3)
        const before = num.toString().slice(0, num.toString().length - 3)
        numStr = before + " " + after
    }
    return numStr.replace(".", ",")
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
     console.log(`Chart-gen listening on port ${port}`)
 })

let yData: YDataSet[] = []
yData.push({label: "Сталь 1", data: [23, 54, 65, 75, 63]})
yData.push({label: "Сталь 2", data: [10, 23, 13, 18, 20]})
const xData = ["01-01-2000", "02-01-2000", "03-01-2000", "04-01-2000", "05-01-2000"]

