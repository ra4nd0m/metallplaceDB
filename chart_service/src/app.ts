import {Chart, ChartConfiguration} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartAnnotations from 'chartjs-plugin-annotation';
import {Request} from "express";
import {Response} from "express/ts4.0";
import {LabelOptions} from "chartjs-plugin-datalabels/types/options";
import * as dotenv from 'dotenv'
const path = require('path');

const express = require('express')
const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const { registerFont, createCanvas } = require('canvas');
import annotationPlugin from "chartjs-plugin-annotation";
let app = express()
dotenv.config({path: path.join(__dirname, '../../.env')})

const port = process.env.CHART_PORT
const host = process.env.CHART_HOST

const orange = "#ec5c24"
const green = '#94bc54'

const fontRegular = 'Montserrat Medium'
const fontExtrabold = 'Montserrat Extrabold'

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
    pointRadius?: any
    pointBackgroundColor?: string
    borderWidth?: number
    predictAccuracy?: number
}

type YDataSet = {
    label: string,
    data: number[]
    predict_accuracy: number
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

const line = 'rgba(0, 0, 0, 0.2)'
const thickLine = 'rgba(0, 0, 0, 0.6)'
const transpLine = 'rgba(0, 0, 0, 0)'

const getChart = async (XLabelSet: string[], YDataSets: YDataSet[], options: ChartOptions): Promise<Buffer> => {
    let width = 1900; //px
    let height
    if (options.tall) {
        height = width / 2;
    } else {
        height = width / 2.5;
    }

    let canvasRenderService
    try{
        canvasRenderService = new ChartJSNodeCanvas({width, height, chartJsFactory});
        canvasRenderService.registerFont(process.cwd() + '/assets/Montserrat-Medium.ttf', { family: 'Montserrat Medium' });
        canvasRenderService.registerFont(process.cwd() + '/assets/Montserrat-ExtraBold.ttf', { family: 'Montserrat Extrabold' });
    } catch (e: unknown){
        console.log(e)
    }
    console.log(process.cwd())

    let datasets: Dataset[] = [];
    let colors: string[]
    if (options.title.length > 0) colors = ['#844a88', '#5d4841', '#F77647','#8ab440', '#e35b33']
    if(YDataSets.length == 1 && options.title.length === 0){
        colors = ['#F77647']
    }
    if(YDataSets.length == 2 && options.title.length === 0){
        colors = [orange, green]
    }
    let i = 0
    let lineThickness = 6*2
    if (options.labels || YDataSets.length >= 2 || options.title.length > 0) lineThickness = 6

    let predictInfoStr = ""
    // Creating dataset lines: material - price feed
    YDataSets.forEach(set => {
        console.log("Pushing ", set.label)
        datasets.push({
            label: `${set.label}`,
            data: set.data,
            lineTension: 0.1,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: lineThickness,
            predictAccuracy: set.predict_accuracy
        });
        predictInfoStr += " " + set.predict_accuracy + "%"
        i++
    })
    options.predictInfoStr = predictInfoStr
    Chart.defaults.font.size = 25;
    let configuration: ChartConfiguration
    try {
        if(options.title.length > 0){
            configuration = getChartConfTitled(datasets, XLabelSet, options);
        } else {
            configuration = getChartConf(datasets, XLabelSet, options);
        }
    } catch (e: any){
        console.log(e)
    }
    // @ts-ignore
    return await canvasRenderService.renderToBuffer(configuration);


}

type ChartOptions = {
    labels?: Partial<LabelOptions>,
    type?: string,
    x_step: string,
    tick_limit: number,
    legend: boolean,
    to_fixed: number,
    title: string,
    predict: boolean,
    tall: boolean,
    predictInfoStr: string
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
    const labelFontSize = 9 * 2 * 2
    let legendFontSize = 7 * 2 * 2
    let axesFontSize = 5 * 2 * 2
    let minRotation = 90
    if (options.tall) {
         axesFontSize = 8 * 2 * 2
    }

    const pointRadius = 3 * 2
    const labelOffset = 10 * 2
    let xAxisLabelsOffset = -10
    if (options.tall) xAxisLabelsOffset *= 2.5
    const labelOffsetDelta = -70
    const textColor = '#000000'
    const predictPointColor = '#844a88'
    const monthPredictAmount = 3

    let dateArrayFormatted: string[]
    dateArrayFormatted = []
    let legendBoxSize
    let tickLimit = 100
    if (options.tick_limit != 0) tickLimit = options.tick_limit
    for (let i = 0; i < dateArray.length; i++) {
        dateArrayFormatted.push(formatXLabel(dateArray[i], options.x_step))

        if (!options.legend){
            legendBoxSize = 0
        }
    }
    // If bar chart - making main line with labels invisible
    if (options.type == "bar"){
        minRotation = 0
        datasets.forEach(ds => {
            ds.borderColor = 'rgba(255,255,255,0)'
        })
    }
    let colors: string[] = []
    if (options.labels && options.type === "line"){
        colors = [orange, green,'#BE7F85']
        let i = 0
        datasets.forEach(ds => {
            ds.pointStyle = 'round'
            ds.pointRadius = pointRadius
            ds.pointBackgroundColor = colors[i]
            ds.borderColor = colors[i]
            i++
        })
    }
    let minVal = Number.MAX_VALUE
    let maxVal = Number.MIN_VALUE
    let bottomBorder
    datasets.forEach(ds => {
        let curMin = Math.min(...ds.data)
        if (curMin < minVal) minVal = curMin
        let curMax = Math.min(...ds.data)
        if (curMax > maxVal) maxVal = curMax
    })
    // for bar charts
    if (maxVal - minVal > 15) {
         bottomBorder = Math.ceil(minVal * 0.95 / 10) * 10;
    } else {
         bottomBorder = Math.floor(minVal * 0.95 / 10) * 10;
    }
    dateArrayFormatted = removeDups(dateArrayFormatted)

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
                        font: function(context) {
                            // Check if it's the third-from-the-end label
                            if (
                                (context.index === dateArray.length - 4 && options.predict) ||
                                (context.index === dateArray.length - 1 && options.type === "bar") ||
                                // @ts-ignore
                                (!options.predict && options.type != "bar" && context.tick.label.includes("Янв"))
                            ) {
                                return {family: fontExtrabold, size: axesFontSize}
                            }
                            else {
                                return {family: fontRegular, size: axesFontSize}
                            }
                        },
                        color: textColor,
                        includeBounds: true,
                        minRotation: minRotation,
                        maxTicksLimit: tickLimit,
                        autoSkip: true,
                        padding: 10,
                        labelOffset: xAxisLabelsOffset
                    },
                    grid: {
                        display: true,
                        drawBorder: false,
                        color: (context) => {
                            if (options.tall) {
                                const value = context.tick.value;
                                // @ts-ignore
                                const label = context.chart.data.labels[value];
                                // @ts-ignore
                                if (label.includes('Янв')) {
                                    return thickLine;
                                }
                                return transpLine;
                            } else if (options.type == "bar"){
                                return line;
                            }
                            else if (options.labels) {
                                const value = context.tick.value;
                                // @ts-ignore
                                const label = context.chart.data.labels[value];
                                // @ts-ignore
                                if (label.includes('Янв')) {
                                    return thickLine;
                                }
                                return line;
                            } else {
                                return transpLine;
                            }
                        },
                    },
                },
                y: {
                    offset: true,
                    type: "linear",
                    ticks: {
                        stepSize: 7,
                        precision: 0,
                        font: {
                            size: axesFontSize,
                            family: fontRegular
                        },
                        color: textColor,
                        maxTicksLimit: 5,
                        maxRotation: 0,
                        callback: (value, index, values) => {
                            let label = formatYLabel(
                                parseFloat(
                                    parseFloat(
                                        parseFloat(value.toString()).toFixed(3).toString()
                                    ).toPrecision(3)
                                )
                            )
                            return label
                        },
                    },
                    grid: {
                        drawOnChartArea: true,
                        drawBorder: false,
                        color: 'rgba(0,0,0, 0.2)'
                    },
                }
            },

            plugins: {
                // annotation: {
                //     annotations: {
                //         label: {
                //             type: 'label',
                //             xValue: 3,
                //             yValue: maxVal,
                //             backgroundColor: 'rgba(245,245,245)',
                //             content: ['This is my text', 'This is my text, second line'],
                //             font: {
                //                 size: 18
                //             }
                //         }
                //     }
                // },
                legend: {
                    display: options.legend,
                    position: "top",
                    align: "start",
                    labels: {
                        font: {
                            size: legendFontSize,
                            family: fontRegular,
                        },
                        boxWidth: legendBoxSize,
                        boxHeight: legendBoxSize,
                        color: textColor,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20
                    }
                }
            },
        },
    }

    let tickCounter = 0
    if (options.predict) {
        // @ts-ignore
        conf.options?.scales?.x.grid =
            {
                color: (context) => {
                    // @ts-ignore
                    const tickOverall = context.chart.data.labels.length;

                    // @ts-ignore
                    if (tickCounter === tickOverall - 4) {
                        tickCounter++
                        return 'rgba(0, 0, 0, 0.6)';
                    }
                    tickCounter++
                    return 'rgba(0, 0, 0, 0.2)';
                },

                lineWidth: 1,
            }
        if (options.x_step == "month") {
            for (let dsIdx = 0; dsIdx < datasets.length; dsIdx++) {
                const length: number = dateArrayFormatted.length;
                const newArray: number[] = Array(length).fill(datasets[dsIdx].pointRadius);
                newArray[length - 4] = datasets[dsIdx].pointRadius * 2.5;
                // @ts-ignore
                datasets[dsIdx].pointRadius = newArray
            }
        }
    }
    // @ts-ignore
    conf.plugins.push(ChartAnnotations)
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
                borderRadius: 0,
                backgroundColor: 'rgba(253,179,151,0)',
                color: 'rgba(0,0,0,1)',
                anchor: 'end',
                display: 'auto',
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

                offset: function(context) {
                    if (datasets.length != 2) {
                        return labelOffset
                    }
                    let curDatasetIdx = context.datasetIndex;
                    let oppositeDatasetIdx = curDatasetIdx === 1 ? 0 : 1;

                    let dataIndex = context.dataIndex; // get the current point index
                    let isTopLine: boolean;

                    // Check which line is on top based on the values of the current point index
                    isTopLine = datasets[curDatasetIdx].data[dataIndex] >= datasets[oppositeDatasetIdx].data[dataIndex];

                    if (isTopLine) {
                        return labelOffset; // Top line label on top
                    } else {
                        return -labelOffset * 3 ; // Bottom line label on bottom
                    }

                },
                align: 'top',
                textAlign: 'center',
                font: function(context) {
                    // Check if it's the third-from-the-end label
                    if (
                        (context.dataIndex === context.dataset.data.length - 4 && options.predict && options.type != "bar") ||
                        (context.dataIndex === context.dataset.data.length - 1 &&  options.type === "bar")
                    ) {
                        return {
                            family: fontExtrabold,
                            size: labelFontSize,
                        };
                    } else {
                        return {
                            family: fontRegular,
                            size: labelFontSize,
                        };
                    }
                },
                clamp: true,

                ...options.labels,
            }
        }
    }
    if (options.type == 'bar') {
        // @ts-ignore
        conf.options?.scales.y.min = bottomBorder
        let changes = getPercentChangesArr(datasets[0].data)

        let labelCnt = 0
        let barColors = []
        for(let i = 0; i < datasets[0].data.length; i++){
            if (i === datasets[0].data.length - 1) {
                barColors.push(orange)
            } else {
                barColors.push('rgba(255, 156, 117, 0.0)')
            }
        }
        // @ts-ignore
        conf.data.datasets.push(
            {
                type: 'bar',
                label: '',
                data: datasets[0].data,
                backgroundColor: barColors,
                borderColor: orange,

                borderWidth: {
                    top: 1,
                    right: 1,
                    bottom: 1,
                    left: 1
                },
                datalabels: {
                    display: false,
                },
                barThickness: 100
            }
        )
        conf.data?.datasets?.push(
            {
                type: 'line',
                label: '',
                data: datasets[0].data,
                borderColor: 'rgba(255,255,255,0)',
                datalabels: {
                    display: true,
                    formatter: function () {
                        return changes[labelCnt]
                    },
                    offset: labelOffset * 3.57,
                    font: {
                        size: labelFontSize * 0.6,
                        family: fontRegular
                    },

                    color: function (context: { dataIndex: any; dataset: { data: { [x: string]: any; }; }; }) {
                        const cur = changes[labelCnt]
                        labelCnt++
                        if (cur === "-") return 'black'
                        if (cur.indexOf("+") != -1) return green
                        if (cur.indexOf("-") != -1) return orange
                        return 'black'
                    }
                }
            }
        )
    }
    return conf
}

function getChartConfTitled(datasets: Dataset[], dateArray: string[], options: ChartOptions): ChartConfiguration{
    for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i];
        let minusOneIndices = 0;
        for (let j = 0; j < dataset.data.length; j++) {
            if (dataset.data[j] > 0) {
                break;
            }
            minusOneIndices++;
        }
        const firstValidIndex = minusOneIndices + 1;
        datasets[i].data = dataset.data.slice(firstValidIndex);
    }
    let basicConf = getChartConf(datasets, dateArray, options)
    // @ts-ignore
    basicConf.options.plugins.legend.position = "bottom"

    // @ts-ignore
    basicConf.options.plugins.title = {
        display: true,
        text: options.title,
        color: '#000000',
        font: {
            family: fontRegular,
            size: 10 * 2,
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
    if (xStep === "day"){
        return `${dateArr[2]}.${dateArr[1]}.${dateArr[0].substring(2, 4)}`
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
            const before = integerPart.slice(0, integerPart.length - 4);

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

function removeDups<T>(arr: T[]): T[] {
    return arr.filter((item, index) => {
        return arr.indexOf(item) === index;
    });
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

app.listen(port, host,() => {
    console.log(`Chart-gen listening on port ${port}`)
})

