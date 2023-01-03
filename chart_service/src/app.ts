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
    let topBorder = Number.MIN_SAFE_INTEGER
    let bottomBorder = Number.MAX_SAFE_INTEGER

    // Creating dataset lines: material - price feed
    YDataSets.forEach(set => {
        console.log("Pushing ", set.label)
        // @ts-ignore
        let minmax = minMax([set.data])
        if (minmax.Max > topBorder) topBorder = minmax.Max
        if (minmax.Min < bottomBorder) bottomBorder = minmax.Min
        datasets.push({
            label: `${set.label}`,
            data: set.data,
            lineTension: 0.15,
            fill: false,
            borderColor: colors[i],
        });
        i++
    })
    Chart.defaults.font.size = 25;
    const configuration: ChartConfiguration = getChartConf(datasets, XLabelSet, options, topBorder, bottomBorder)
    return await canvasRenderService.renderToBuffer(configuration);
}

type ChartOptions = {
    labels?: Partial<LabelOptions>,
    type?: string,
    x_step: string,
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

function getChartConf(datasets: Dataset[], dateArray: string[], options: ChartOptions, topBorder: number, bottomBorder: number): ChartConfiguration {
    const labelFontSize = 17
    const legendFontSize = 20
    const axesFontSize = 25
    const pointRadius = 1
    const labelOffset = 5

    let dateArrayFormatted = []
    let legendBoxSize = 13
    for (let i = 0; i < dateArray.length; i++) {
        if (options.labels) {
            dateArrayFormatted.push(formatXLabel(dateArray[i], options.x_step))
        } else {
            legendBoxSize = 0
            dateArrayFormatted.push(formatXLabel(dateArray[i], options.x_step))
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
                    type: "category",
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
                    type: "linear",
                    ticks: {
                        precision: 0,
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
                    //let x = getToFixed(datasets)
                    //if (x > 0) {
                    //    let cur = label.substring(label.indexOf(",")).length - 1
                    //    return label + "0".repeat(x - cur);
                    //}
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

function minMax(arrays: number[][]) {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    for (const arr of arrays) {
        for (const v of arr) {
            min = Math.min(min, v);
            max = Math.max(max, v);
        }
    }

    return {Min: min, Max: max}
}

function formatXLabel(dateStr: string, xStep: string): string {
    const dateArr = dateStr.split("-")
    if (xStep === "week") {
        const date = new Date(Date.parse(dateStr));
        const weekNumber =  getWeekNumber(date);
        const year = date.getFullYear();
        return `${weekNumber} (${year})`;
    }
    if (xStep === "month"){
        return getRuMonth(dateStr)
    }
    if (dateArr.length < 3) return dateStr
    return `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`

}

function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = ((date.getTime() - firstDayOfYear.getTime()) / 86400000) + 1;
    return Math.ceil(dayOfYear / 7);
}

// @ts-ignore
function getRuMonth(dateStr: string): string {
    const date = new Date(Date.parse(dateStr));
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    switch (month) {
        case 0:
            return 'Янв\'' + year;
        case 1:
            return 'Фев\'' + year;
        case 2:
            return 'Мар\'' + year;
        case 3:
            return 'Апр\'' + year;
        case 4:
            return 'Май\'' + year;
        case 5:
            return 'Июн\'' + year;
        case 6:
            return 'Июл\'' + year;
        case 7:
            return 'Авг\'' + year;
        case 8:
            return 'Сен\'' + year;
        case 9:
            return 'Окт\'' + year;
        case 10:
            return 'Ноя\'' + year;
        case 11:
            return 'Дек\'' + year;
    }
}

function formatYLabel(num: number) {
    let numStr = num.toString()
    if (num >= 1000) {
        if(numStr.indexOf(".") != -1){
            let [integerPart, decimalPart] = num.toString().split('.');

            // Extract the last three digits of the integer part and the rest of the digits
            const after = integerPart.slice(-3);
            const before = integerPart.slice(0, integerPart.length - 3);

            // Concatenate the integer part and the decimal part, with a space as a thousand separator and a comma as a decimal separator
            numStr = `${before} ${after}.${decimalPart}`;
        } else {
            const after = num.toString().slice(-3)
            const before = num.toString().slice(0, num.toString().length - 3)
            numStr = (before + " " + after)
        }

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

