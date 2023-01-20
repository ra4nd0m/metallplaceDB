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
    backgroundColor: string
    pointStyle?: string
    pointRadius?: number
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

const getChart = async (XLabelSet: string[], YDataSets: YDataSet[], options: ChartOptions, type: string): Promise<Buffer> => {
    let width = 900; //px
    let height = 450; //px
    const canvasRenderService = new ChartJSNodeCanvas({width, height, chartJsFactory});
    let datasets: Dataset[] = [];
    let colors = ['rgb(55, 74, 116)', 'rgb(100, 70, 96)', 'rgb(100, 0, 100)']
    if(YDataSets.length == 1){
        colors = ['rgb(247,118,71)']
    }
    if(YDataSets.length == 2){
        colors = ['rgb(247,118,71)', 'rgb(150,118,71)']
    }
    let i = 0

    // Creating dataset lines: material - price feed
    YDataSets.forEach(set => {
        console.log("Pushing ", set.label)

        datasets.push({
            label: `${set.label}`,
            data: set.data,
            lineTension: 0.15,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i]
        });
        i++
    })
    Chart.defaults.font.size = 25;
    let configuration: ChartConfiguration

    switch (type){
        case "titled": {
            configuration = getChartConfTitled(datasets, XLabelSet, options);
            break
        }
        default:{
            configuration = getChartConf(datasets, XLabelSet, options);
            break
        }
    }
    return await canvasRenderService.renderToBuffer(configuration);
}

type ChartOptions = {
    labels?: Partial<LabelOptions>,
    type?: string,
    x_step: string,
    tick_limit: number,
    legend: boolean,
    to_fixed: number,
    title: string
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
    const labelFontSize = 9 * 2
    const legendFontSize = 9 * 2
    const axesFontSize = 9 * 2
    const pointRadius = 1
    const labelOffset = 5
    const fontRegular = 'Montserrat'
    const textColor = '#000000'
    let gridOnChartArea = true

    let dateArrayFormatted: string[]
    dateArrayFormatted = []
    let legendBoxSize = 13
    let tickLimit = 27
    if (options.tick_limit != 0) tickLimit = options.tick_limit
    for (let i = 0; i < dateArray.length; i++) {
        if (options.labels) {
            gridOnChartArea = false
        }
        dateArrayFormatted.push(formatXLabel(dateArray[i], options.x_step))

        if (!options.legend){
            legendBoxSize = 0
        }
    }
    // If bar chart - making main line with labels invisible
    if (options.type == "bar"){
        datasets.forEach(ds => {
            ds.borderColor = 'rgba(255,255,255,0)'
        })
    }
    if (options.labels && options.type === "line"){
        datasets.forEach(ds => {
            ds.pointStyle = 'triangle'
            ds.pointRadius = 7
        })
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
                        font: {
                            size: axesFontSize,
                            family: fontRegular,
                        },
                        color: textColor,
                        includeBounds: true,
                        maxRotation: 70,
                        maxTicksLimit: tickLimit,
                        autoSkip: true
                    },
                    grid: {
                        display: false,
                        borderColor: '#000000'
                    },
                },
                y: {
                    offset: true,
                    type: "linear",
                    ticks: {
                        precision: 0,
                        font: {
                            size: axesFontSize,
                            family: fontRegular
                        },
                        color: textColor,
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
                    grid: {
                        drawOnChartArea: gridOnChartArea,
                        borderColor: '#000000'
                    },

                }
            },

            plugins: {
                legend: {
                    display: false,
                    position: "top",
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: legendFontSize,
                            family: fontRegular,
                        },
                        boxWidth: legendBoxSize,
                        boxHeight: legendBoxSize,
                        color: textColor
                    }
                }
            },
        },
    }
    if (options.labels) {
        let toFixed: number
        if (options.to_fixed != -1){
            toFixed = options.to_fixed
        } else {
            toFixed = getToFixed(datasets)
        }
        // @ts-ignore
        conf.plugins.push(ChartDataLabels)
        // @ts-ignore
        conf.options.plugins = {
            ...conf.options?.plugins,
            datalabels: {
                offset: labelOffset,
                borderRadius: 4,
                backgroundColor: 'rgba(253,179,151,0)',
                color: 'rgba(0,0,0,1)',
                anchor: 'end',
                formatter: function (value, context) {
                    let label = ""
                    if (toFixed > 0) {
                        label = formatYLabel(value)
                        if(label.indexOf(",") === -1){
                            return `${label},${"0".repeat(toFixed)}`
                        }
                        let cur = label.substring(label.indexOf(",")).length - 1
                        return label + "0".repeat(toFixed - cur);
                    } else if (toFixed == 0){
                        return formatYLabel(Math.round(+value))
                    }
                    return formatYLabel(value)
                },
                align: 'top',
                textAlign: 'center',
                font: {
                    size: labelFontSize,
                    family: fontRegular,
                },
                clamp: true,

                ...options.labels,
            }
        }
        // @ts-ignore
        conf.options.elements.point.radius = pointRadius
    }
    // @ts-ignore
    conf.options?.plugins?.legend?.display = options.legend
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
                backgroundColor: ['#FF9C75', '#FF9C75', '#FF9C75', '#FF9C75', '#F77647'],
                borderColor: '#000000',
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
                borderColor: 'rgba(255,255,255,0)',
                datalabels: {
                    display: true,
                    formatter: function () {
                        return changes[labelCnt]
                    },
                    backgroundColor: '#FFFFFF',
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

function getChartConfTitled(datasets: Dataset[], dateArray: string[], options: ChartOptions): ChartConfiguration{
    let basicConf = getChartConf(datasets, dateArray, options)
    // @ts-ignore
    basicConf.options.plugins.legend.position = "bottom"
    // @ts-ignore
    basicConf.options.plugins.title = {
        display: true,
        text: options.title,
        color: '#000000',
        font: {
            family: 'Montserrat Bold',
            size: 9 * 2,
        }
    }
    return basicConf
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
    // if getting in format xxi-21 or xx
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
    getChart(req.body.x_label_set, req.body.y_data_set, req.body.chart_options, "default")
        .then(buf =>
            res.send(buf)
        )
        .catch(reason =>
            res.send(JSON.stringify(reason))
        )
})

app.post('/genTitled', (req: Request, res: Response) => {
    getChart(req.body.x_label_set, req.body.y_data_set, req.body.chart_options, "titled")
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

