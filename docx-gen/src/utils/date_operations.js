const {endOfWeek, startOfWeek} = require("date-fns");

module.exports.GetWeekDates = function getWeekDates(date){
    if(date === undefined){
        date = Date.now()
    }
    const firstDay = startOfWeek(date, {weekStartsOn: 1});
    const lastDay = endOfWeek(date, {weekStartsOn: 1});

    return {
        first: {
            day: firstDay.getDate(),
            month: firstDay.getMonth(),
            year: firstDay.getFullYear()
        },
        last: {
            day: lastDay.getDate(),
            month: lastDay.getMonth(),
            year: lastDay.getFullYear()
        }
    }
}

module.exports.GetWeekNumber = function getWeekNumber(date){
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}



// module.exports.GetMonthRange = function getMonthRange(date){
//     let first = date
//     first.setMonth(first.setMonth - 1)
//     return `${first.getDate()}-${first.getMonth()}-${first.getFullYear()}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
// }

module.exports.FormatDayMonth = function formatDayMonth(num){
    if (num <= 9) return `0${num}`
    return num
}

