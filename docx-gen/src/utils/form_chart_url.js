const {ApiEndpoint} = require("../const")
module.exports.ChartUrl = function (materialIds, propertyId, timeFrame, needLabels, type, scale, xStep, needLegend, toFixed, predict, isTall){
    this.materialIds = materialIds
    this.propertyId = propertyId
    this.timeFrame = timeFrame
    this.needLabels = needLabels
    this.type = type
    this.scale = scale
    this.xStep = xStep
    this.legend = needLegend
    this.toFixed = toFixed
    this.predict = predict
    this.isTall = isTall
}

module.exports.FormChartUrl = function (ChartUrl){
    let url = ApiEndpoint + "/getChart/"
    const materialIds = ChartUrl.materialIds.join("-")
    if(ChartUrl.toFixed === undefined) ChartUrl.toFixed = -1
    if(ChartUrl.predict === undefined) ChartUrl.predict = 0
    if(ChartUrl.isTall === undefined) ChartUrl.isTall = 0

    url += materialIds + "_" + ChartUrl.propertyId + "_" + ChartUrl.timeFrame + "_" + ChartUrl.needLabels + "_" +
        ChartUrl.type + "_" + ChartUrl.scale + "_" + ChartUrl.xStep + "_" + ChartUrl.legend +
        "_" + ChartUrl.toFixed + "_" + ChartUrl.predict + "_" +ChartUrl.isTall + ".png"
    return url
}