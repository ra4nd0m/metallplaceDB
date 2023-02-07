const {FormatDayMonth} = require("./date_operations");

module.exports.formatDateDb = (d) => {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    return `${d.getFullYear()}-${FormatDayMonth(d.getMonth() + 1)}-${FormatDayMonth(d.getDate())}`
}

module.exports.formatDateTable = (d, type) => {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    if (type === "month"){
        return getRuMonth(d)
    }
    if (type === "monthFull"){
        return getRuMonthFull(d)
    }
    return `${FormatDayMonth(d.getDate())}.${FormatDayMonth(d.getMonth() + 1)}.${d.getFullYear()}`
}

function getRuMonthFull(date){
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    switch (month) {
        case 0:
            return 'январь';
        case 1:
            return 'февраль';
        case 2:
            return 'март';
        case 3:
            return 'апрель';
        case 4:
            return 'май';
        case 5:
            return 'июнь';
        case 6:
            return 'июль';
        case 7:
            return 'август';
        case 8:
            return 'сентябрь';
        case 9:
            return 'октябрь';
        case 10:
            return 'ноябрь';
        case 11:
            return 'декабрь';
    }
}

function getRuMonth(date) {
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    switch (month) {
        case 0:
            return 'Янв\'' + year;
        case 1:
            return 'Фев\'' + year;
        case 2:
            return 'Мар\'' + year;
        case 3:
            return 'Апр\'' + year;
        case 4:
            return 'Май\'' + year;
        case 5:
            return 'Июн\'' + year;
        case 6:
            return 'Июл\'' + year;
        case 7:
            return 'Авг\'' + year;
        case 8:
            return 'Сен\'' + year;
        case 9:
            return 'Окт\'' + year;
        case 10:
            return 'Ноя\'' + year;
        case 11:
            return 'Дек\'' + year;
    }
}
