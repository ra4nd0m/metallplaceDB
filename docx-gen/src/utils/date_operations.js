const m = require("moment");

module.exports.GetWeekDates = function getWeekDates(){
    const firstDay = m().startOf("isoWeek").toDate();
    const lastDay = m().endOf("isoWeek").toDate();

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

module.exports.GetWeekNumber = function getWeekNumber(){
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}

