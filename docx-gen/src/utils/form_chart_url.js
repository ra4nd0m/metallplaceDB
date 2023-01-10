const {mainServerHost, mainServerPort} = require("../const")
module.exports.ChartUrl = function (materialIds, propertyId, timeFrame, isBig, type, scale, xStep, needLegend, toFixed){
    this.materialIds = materialIds
    this.propertyId = propertyId
    this.timeFrame = timeFrame
    this.isBig = isBig
    this.type = type
    this.scale = scale
    this.xStep = xStep
    this.legend = needLegend
    this.toFixed = toFixed
}

module.exports.FormChartUrl = function (ChartUrl){
    let url = "http://" + mainServerHost + ":" + mainServerPort + "/getChart/"
    const materialIds = ChartUrl.materialIds.join("-")
    if(ChartUrl.toFixed == undefined) ChartUrl.toFixed = -1

    url += materialIds + "_" + ChartUrl.propertyId + "_" + ChartUrl.timeFrame + "_" + ChartUrl.isBig + "_" +
        ChartUrl.type + "_" + ChartUrl.scale + "_" + ChartUrl.xStep + "_" + ChartUrl.legend + "_" + ChartUrl.toFixed +".png"
    return url
}