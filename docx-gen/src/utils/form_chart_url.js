const {mainServerHost, mainServerPort} = require("../const")
module.exports.ChartUrl = function (materialIds, propertyId, timeFrame, isBig, type, group){
    this.materialIds = materialIds
    this.propertyId = propertyId
    this.timeFrame = timeFrame
    this.isBig = isBig
    this.type = type
    this.group = group
}

module.exports.FormChartUrl = function (ChartUrl){
    let url = "http://" + mainServerHost + ":" + mainServerPort + "/getChart/"
    const materialIds = ChartUrl.materialIds.join("-")
    if(ChartUrl.group === undefined) ChartUrl.group = 0

    url += materialIds + "_" + ChartUrl.propertyId + "_" + ChartUrl.timeFrame + "_" + ChartUrl.isBig + "_" + ChartUrl.type + "_" + ChartUrl.group + ".png"
    return url
}