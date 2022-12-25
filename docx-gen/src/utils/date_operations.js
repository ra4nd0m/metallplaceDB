const {endOfWeek, startOfWeek, startOfMonth, endOfMonth, isValid} = require("date-fns");

module.exports.GetDates = function (date, type) {
    if (!date || !isValid(date)) {
        throw new Error('Invalid date');
    }

    let firstDay, lastDay;
    if (type === 'week') {
        firstDay = startOfWeek(date, { weekStartsOn: 1 });
        lastDay = endOfWeek(date, { weekStartsOn: 1 });
    } else if (type === 'month') {
        firstDay = startOfMonth(date);
        lastDay = endOfMonth(date);
    } else {
        throw new Error('Invalid type');
    }

    return {
        first: {
            day: firstDay.getDate(),
            month: firstDay.getMonth(),
            year: firstDay.getFullYear(),
        },
        last: {
            day: lastDay.getDate(),
            month: lastDay.getMonth(),
            year: lastDay.getFullYear(),
        },
    };
};

module.exports.GetLastDayOfMonth = function (date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

module.exports.GetLastDayOfWeek = function (date){
    let d = new Date(date);
    return new Date(d.setDate(d.getDate() + (5 - d.getDay())));
}

module.exports.GetWeekNumber = function (date){
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}

module.exports.Get2LastFridays = function (date){
    const first = date.getDate() - date.getDay() + 1;
    const fifth = first + 4;

    const friday = new Date(date.setDate(fifth));
    let lastFriday = new Date(friday)
    lastFriday.setDate(lastFriday.getDate() - 7)

    return [lastFriday, friday];
}

module.exports.Get2LastThursdays = function (date){
    const first = date.getDate() - date.getDay() + 1;
    const fifth = first + 3;

    const friday = new Date(date.setDate(fifth));
    let lastThursday = new Date(friday)
    lastThursday.setDate(lastThursday.getDate() - 7)

    return [lastThursday, friday];
}

module.exports.FormatDayMonth = function (num){
    if (num <= 9) return `0${num}`
    return num
}

