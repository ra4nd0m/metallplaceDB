module.exports = function (datasets) {
    let max = 0
    datasets.forEach(dataset => {
        dataset.forEach(n =>{
            const str = n.value.toString()
            let cur = str.substring(str.indexOf(".")).length - 1
            if(cur > max && str.indexOf(".") !== -1) max = cur
        })
    })

    return max
}