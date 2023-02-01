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

module.exports.GetFirstDayOfMonth = function (date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
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

module.exports.Get2LastMondays = function (date){
    const currentWeekMonday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const previousWeekMonday = new Date(currentWeekMonday.getFullYear(), currentWeekMonday.getMonth(), currentWeekMonday.getDate() - 7);

    return [previousWeekMonday, currentWeekMonday];
}

module.exports.GetFirstDaysOfCurrentAndPrevMonth = function (date) {
    const currentMonth = date.getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1; // handle January (0) by wrapping around to December (11)

    const currentMonthFirstDay = new Date(date.getFullYear(), currentMonth, 1);
    const prevMonthFirstDay = new Date(date.getFullYear(), prevMonth, 1);

    return [ prevMonthFirstDay, currentMonthFirstDay ];
}

module.exports.Get2LastThursdays = function (date){
    const first = date.getDate() - date.getDay() + 1;
    const fourth = first + 3;

    const thursday = new Date(date.setDate(fourth));
    let lastThursday = new Date(thursday)
    lastThursday.setDate(lastThursday.getDate() - 7)

    return [lastThursday, thursday];
}

module.exports.FormatDayMonth = function (num){
    if (num <= 9) return `0${num}`
    return num
}

