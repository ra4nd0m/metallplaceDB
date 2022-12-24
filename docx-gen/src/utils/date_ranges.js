const {GetWeekDates, FormatDayMonth} = require("./date_operations");


module.exports.GetMonthRange = function (date, isRaw){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 28)
    if(isRaw) return [new Date(first), new Date(last)]

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}
module.exports.GetYearRange = function (date){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 365)

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}

module.exports.Get2YearRange = function (date){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 365 * 2)

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}

module.exports.GetWeekRange = function (date, isRaw){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 5)
    if (isRaw){
        return [new Date(first), new Date(last)]
    }

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}

module.exports.Get2WeekRange = function (date, isRaw){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 11)
    if (isRaw){
        return [new Date(first), new Date(last)]
    }

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}