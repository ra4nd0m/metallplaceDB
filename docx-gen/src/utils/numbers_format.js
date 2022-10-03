module.exports = function (v){
    if (!isNaN(v)){
        if(v.toString().indexOf('.') !== -1){
            v = v.toString().replace(".", ",")
            return v
        }else {
            if(v >= 1000){
                const after = v.toString().slice(-3)
                const before = v.toString().slice(0, v.toString().length - 3)
                v = before + " " + after
            }
            return v
        }
    }
    return v
}