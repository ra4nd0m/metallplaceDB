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

function getPercentChangesArr(prices: number[]): string[] {
    let changes: string[] = []
    let change
    for (let i = 1; i < prices.length; i++) {
        change = Math.round((prices[i] - prices[i - 1]) * 1000) / 1000
        if (change > 0) changes.push(`+${change.toString().replace(".", ",")}`)
        if (change < 0) changes.push(`${change.toString().replace(".", ",")}`)
        if (change === 0) changes.push(`-`)
    }
    changes.unshift("-")
    return changes
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


function getToFixed(datasets: Dataset[]): number {
    let max = 0
    datasets.forEach(dataset => {
        dataset.data.forEach(n => {
            const str = n.toString()
            let cur = str.substring(str.indexOf(".")).length - 1
            if (cur > max && str.indexOf(".") != -1) max = cur
        })
    })
    return max
}

function getChartConf(datasets: Dataset[], dateArray: string[], options: ChartOptions): ChartConfiguration {
    const labelFontSize = 17
    const legendFontSize = 20
    const axesFontSize = 25
    const pointRadius = 1
    const labelOffset = 5

    let dateArrayFormatted = []
    let legendBoxSize = 13
    for (let i = 0; i < dateArray.length; i++) {
        if (options.labels) {
            dateArrayFormatted.push(formatXLabel(dateArray[i], false))
        } else {
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
                    radius: 0
                }
            },
            scales: {
                x: {
                    offset: true,
                    ticks: {
                        font: {size: axesFontSize},
                        includeBounds: true,
                        maxRotation: 70,
                        maxTicksLimit: 27,
                        autoSkip: true
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    offset: true,
                    ticks: {
                        font: {size: axesFontSize},
                        maxTicksLimit: 5,
                        maxRotation: 0,
                        callback: (value, index, values) => {
                            return formatYLabel(
                                parseFloat(
                                    parseFloat(
                                        parseFloat(value.toString()).toFixed(3).toString()
                                    ).toPrecision(3)
                                )
                            )
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
                formatter: function (value, context) {
                    let label = formatYLabel(value)
                    let x = getToFixed(datasets)
                    if (x > 0) {
                        let cur = label.substring(label.indexOf(",")).length - 1
                        return label + "0".repeat(x - cur);
                    }
                    return label
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
        conf.options.elements.point.radius = pointRadius
    }
    if (options.type == 'bar') {

        let changes = getPercentChangesArr(datasets[0].data)
        // @ts-ignore
        //conf.options?.scales?.xAxes.ticks.stepSize = 200;
        let halfData: number[] = []
        datasets[0].data.forEach(d => {
            halfData.push(Math.round(d / 2));
        })
        let labelCnt = 0
        conf.data.datasets.push(
            {
                type: 'bar',
                label: '',
                data: datasets[0].data,
                borderColor: 'rgb(55, 74, 116)',
                datalabels: {
                    display: false,
                }
            }
        )
        conf.data?.datasets?.push(
            {
                type: 'line',
                label: '',
                data: halfData,
                datalabels: {
                    display: true,
                    formatter: function () {
                        return changes[labelCnt]
                    },
                    color: function (context: { dataIndex: any; dataset: { data: { [x: string]: any; }; }; }) {
                        const cur = changes[labelCnt]
                        labelCnt++
                        if (cur === "-") return 'black'
                        if (cur.indexOf("+") != -1) return 'green'
                        if (cur.indexOf("-") != -1) return 'red'
                        return 'black'
                    }
                }
            }
        )
    }
    return conf
}

function formatXLabel(date: string, ifWeek: boolean): string {
    const dateArr = date.split("-")
    if (!ifWeek) {
        return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`
    }
    let currentDate = new Date(Date.UTC(Number(dateArr[0]), Number(dateArr[1]) - 1, Number(dateArr[2])));
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    // @ts-ignore
    let days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));

    let week = Math.ceil(days / 7);
    console.log(date + " - " + week + "week")
    return `${week} (${dateArr[0]})`
}

function formatYLabel(num: number) {
    let numStr = num.toString()
    if (num >= 1000) {
        const after = num.toString().slice(-3)
        const before = num.toString().slice(0, num.toString().length - 3)
        numStr = before + " " + after
    }
    return numStr.replace(".", ",")
}

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

