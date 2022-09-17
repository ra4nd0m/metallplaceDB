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

module.exports.GetWeekNumber = function getWeekNumber(num){
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}

module.exports.FormatDayMonth = function formatDayMonth(num){
    if (num <= 9) return `0${num}`
    return num
}

