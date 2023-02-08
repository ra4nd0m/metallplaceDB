import {Chart, ChartConfiguration} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Request} from "express";
import {Response} from "express/ts4.0";
import {LabelOptions} from "chartjs-plugin-datalabels/types/options";

const express = require('express')
const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const annotation = require('chartjs-plugin-annotation')
import Annotation from 'chartjs-plugin-annotation'
import {inspect} from "util";
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

const getChart = async (XLabelSet: string[], YDataSets: YDataSet[], options: ChartOptions): Promise<Buffer> => {
    let width = 900; //px
    let height = 450; //px
    const canvasRenderService = new ChartJSNodeCanvas({width, height, chartJsFactory});
    let datasets: Dataset[] = [];
    let colors: string[]
    if (options.title.length > 0) colors = ['#844a88', '#5d4841', '#e35b33','#7b8a63', '#e35b33']
    if(YDataSets.length == 1){
        colors = ['#F77647']
    }
    if(YDataSets.length == 2){
        colors = ['#a1806a', '#7b8a63']
    }
    let i = 0
    let lineThickness = 6
    if (options.labels || YDataSets.length >= 2) lineThickness = 2

    // Creating dataset lines: material - price feed
    YDataSets.forEach(set => {
        console.log("Pushing ", set.label)
        datasets.push({
            label: `${set.label}`,
            data: set.data,
            lineTension: 0.15,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: lineThickness,
            predictAccuracy: set.predict_accuracy
        });
        i++
    })
    Chart.defaults.font.size = 25;
    let configuration: ChartConfiguration
    if(options.title.length > 0){
        configuration = getChartConfTitled(datasets, XLabelSet, options);
    } else {
        configuration = getChartConf(datasets, XLabelSet, options);
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
    title: string,
    predict: boolean,
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
    const labelFontSize = 7 * 2
    const legendFontSize = 9 * 2
    const axesFontSize = 9 * 2
    const pointRadius = 3
    const labelOffset = 0
    const fontRegular = 'Montserrat'
    const textColor = '#000000'
    const predictPointColor = '#844a88'
    const monthPredictAmount = 3
    let gridOnChartArea = true

    let dateArrayFormatted: string[]
    dateArrayFormatted = []
    let legendBoxSize
    options.type === 'bar' ?  legendBoxSize = 0 :  legendBoxSize = 13
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
    let colors: string[] = []
    if (options.labels && options.type === "line"){
        colors = ['#FF9C75', '#BEDF85','#BE7F85']
        let i = 0
        datasets.forEach(ds => {
            ds.pointStyle = 'round'
            ds.pointRadius = pointRadius
            ds.pointBackgroundColor = colors[i]
            i++
        })
    }
    let minVal = Number.MAX_VALUE
    datasets.forEach(ds => {
        let curMin = Math.min(...ds.data)
        if (curMin < minVal) minVal = curMin
    })
    // for bar charts
    let bottomBorder = minVal * 0.96

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
                    display: options.legend,
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
    let predictAccuracyTime = ""
    if (options.predict) {
        if (options.x_step=="month") {
            for(let dsIdx = 0; dsIdx < datasets.length; dsIdx ++){
                // @ts-ignore
                datasets[dsIdx].pointBackgroundColor = Array(datasets[dsIdx].data.length-monthPredictAmount)
                    .fill(colors[dsIdx]).concat(Array(monthPredictAmount).fill(predictPointColor));
                // @ts-ignore
                datasets[dsIdx].borderColor = Array(datasets[dsIdx].data.length-monthPredictAmount)
                    .fill(colors[dsIdx]).concat(Array(monthPredictAmount).fill(predictPointColor));
                predictAccuracyTime = getRuMonthFull(dateArray[dateArray.length - monthPredictAmount - 1])
            }
        }
        let annotationsText: string[] = ["Точность прогноза за " + predictAccuracyTime + ":"]
        datasets.forEach(d => {
            annotationsText.push(d.label + " - " + d.predictAccuracy + "%")
        })
        // @ts-ignore
        conf.options.plugins.title = {
            display: true,
            text: annotationsText,
            position: 'bottom',
            color: '#000000',
            font: {
                family: 'Montserrat Thin',
                size: 8 * 2,
            }
        }
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
    }
    if (options.type == 'bar') {
        // @ts-ignore
        conf.options?.scales.y.min = bottomBorder
        let changes = getPercentChangesArr(datasets[0].data)
        let halfData: number[] = []
        datasets[0].data.forEach(d => {
            if (minVal > 50) {
                halfData.push(minVal*0.98);
            } else if (minVal < 5){
                halfData.push(minVal * 0.80)
            } else {
                halfData.push(minVal * 0.93);
            }
        })
        let labelCnt = 0
        let barColors = []
        for(let i = 0; i < datasets[0].data.length; i++){
            if (i === datasets[0].data.length - 1) {
                barColors.push('#F77647')
            } else {
                barColors.push('#FF9C75')
            }
        }
        // @ts-ignore
        conf.data.datasets.push(
            {
                type: 'bar',
                label: '',
                data: datasets[0].data,
                backgroundColor: barColors,
                borderColor: '#000000',
                datalabels: {
                    display: false,
                },
                barThickness: 80
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
            family: 'Montserrat Medium',
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

// @ts-ignore
function getRuMonthFull(dateStr: string): string {
    const date = new Date(Date.parse(dateStr));
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    switch (month) {
        case 0:
            return 'январь';
        case 1:
            return 'февраль';
        case 2:
            return 'март';
        case 3:
            return 'апрель';
        case 4:
            return 'май';
        case 5:
            return 'июнь';
        case 6:
            return 'июль';
        case 7:
            return 'август';
        case 8:
            return 'сентябрь';
        case 9:
            return 'октябрь';
        case 10:
            return 'ноябрь';
        case 11:
            return 'декабрь';
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

