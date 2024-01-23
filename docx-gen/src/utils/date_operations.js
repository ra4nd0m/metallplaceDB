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
        var tdt = new Date(date.valueOf());
        var dayn = (date.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4)
        {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);

}

module.exports.Get2LastMondays = function (date){
    const currentWeekMonday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const previousWeekMonday = new Date(currentWeekMonday.getFullYear(), currentWeekMonday.getMonth(), currentWeekMonday.getDate() - 7);

    return [previousWeekMonday, currentWeekMonday];
}

module.exports.GetFirstDaysOfCurrentAndPrevMonth = function (date) {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear()
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1; // handle January (0) by wrapping around to December (11)


    const currentMonthFirstDay = new Date(date.getFullYear(), currentMonth, 1);
    const prevMonthFirstDay = new Date(prevYear, prevMonth, 1);

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

module.exports.AddDaysToDate = function (inputDate, n) {
    var date = new Date(inputDate);
    date.setDate(date.getDate() + n);

    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');

    return year + '-' + month + '-' + day;
}

