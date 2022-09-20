const {GetWeekDates, FormatDayMonth} = require("./date_operations");


module.exports.GetMonthRange = function (date, isRaw){
    const weekDates = GetWeekDates(date)
    const last = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    let first = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    first.setDate(first.getDate() - 28)
    if(isRaw) return [first, last]

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}
module.exports.GetYearRange = function (date){
    const weekDates = GetWeekDates(date)
    const last = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    let first = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    first.setDate(first.getDate() - 365)

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}
module.exports.GetWeekRange = function (date, isRaw){
    const weekDates = GetWeekDates(date)
    const last = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    let first = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    first.setDate(first.getDate() - 5)
    if (isRaw){
        return [first, last]
    }

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}

module.exports.Get2WeekRange = function (date, isRaw){
    const weekDates = GetWeekDates(date)
    const last = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    let first = new Date(Date.UTC(weekDates.last.year, weekDates.last.month, weekDates.last.day - 2))
    first.setDate(first.getDate() - 11)
    if (isRaw){
        return [first, last]
    }

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}