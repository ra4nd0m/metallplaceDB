import {LabelOptions} from "chartjs-plugin-datalabels/types/options";

export type Dataset = {
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

export type YDataSet = {
    label: string,
    data: number[]
    predict_accuracy: number
}

export type PredictLabelInfo = {
    material: string,
    accuracy: number
}

export type ChartOptions = {
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
