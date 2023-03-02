const {mainServerPort} = require("../const")
module.exports.ChartUrl = function (materialIds, propertyId, timeFrame, isBig, type, scale, xStep, needLegend, toFixed, predict){
    this.materialIds = materialIds
    this.propertyId = propertyId
    this.timeFrame = timeFrame
    this.isBig = isBig
    this.type = type
    this.scale = scale
    this.xStep = xStep
    this.legend = needLegend
    this.toFixed = toFixed
    this.predict = predict
}

module.exports.FormChartUrl = function (ChartUrl){
    let url = "http://" + process.env.HTTP_HOST + ":" + mainServerPort + "/getChart/"
    const materialIds = ChartUrl.materialIds.join("-")
    if(ChartUrl.toFixed === undefined) ChartUrl.toFixed = -1
    if(ChartUrl.predict === undefined) ChartUrl.predict = 0

    url += materialIds + "_" + ChartUrl.propertyId + "_" + ChartUrl.timeFrame + "_" + ChartUrl.isBig + "_" +
        ChartUrl.type + "_" + ChartUrl.scale + "_" + ChartUrl.xStep + "_" + ChartUrl.legend +
        "_" + ChartUrl.toFixed + "_" + ChartUrl.predict +".png"
    return url
}