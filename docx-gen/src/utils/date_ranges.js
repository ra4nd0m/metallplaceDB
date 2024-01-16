const {GetWeekDates, FormatDayMonth} = require("./date_operations");


module.exports.GetMonthRange = function (date, isRaw, isShortened){
    let last = new Date(date)
    let first = new Date(date)
    first.setMonth(first.getMonth() - 1)
    last.setDate(last.getDate() + 1)
    if (isShortened) {
        first = getMondayOfWeek(first.setDate(first.getDate() + 7))
    } else {
        first = getFridayOfWeek(first)
    }
    last = getFridayOfWeek(last)
    if(isRaw) return [new Date(first), new Date(last)]

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}
function getFridayOfWeek(givenDate) {
    let date = new Date(givenDate);
    let day = date.getDay();
    let diff = 5 - day; // 5 represents Friday (0 is Sunday, 1 is Monday, and so on)
    date.setDate(date.getDate() + diff);
    return date;
}

function getMondayOfWeek(givenDate) {
    let date = new Date(givenDate);
    let day = date.getDay();
    let diff = 1 - day; // 5 represents Friday (0 is Sunday, 1 is Monday, and so on)
    date.setDate(date.getDate() + diff);
    return date;
}
module.exports.GetHalfYearRange = function (date, isRaw){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 183)
    if(isRaw) return [new Date(first), new Date(last)]

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}

module.exports.GetYearRange = function (date, isRaw){
    const last = new Date(date)
    let first = new Date(date)
    first.setDate(first.getDate() - 365)
    // snap to next monday
    let daysUntilNextMonday = 8 - date.getDay() + 1;
    first.setDate(first.getDate() + daysUntilNextMonday);

    if (isRaw){
        return [new Date(first), new Date(last)]
    }

    return `${FormatDayMonth(first.getMonth()+1)}-${FormatDayMonth(first.getDate())}-${first.getFullYear()}_`+
        `${FormatDayMonth(last.getMonth()+1)}-${FormatDayMonth(last.getDate())}-${last.getFullYear()}`
}

module.exports.GetNMonthRange = function (date, n, isRaw, toFuture){
    const last = new Date(date)
    let first = new Date(date)
    if(toFuture) {
        first.setMonth(first.getMonth() + 1)
        last.setMonth(last.getMonth() + n)
    } else {
        first.setMonth(first.getMonth() - n)
    }

    if (isRaw){
        return [new Date(first), new Date(last)]
    }

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