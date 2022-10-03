const {FormatDayMonth} = require("./date_operations");

module.exports.formatDateDb = (d) => {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    return `${d.getFullYear()}-${FormatDayMonth(d.getMonth() + 1)}-${FormatDayMonth(d.getDate())}`
}

module.exports.formatDateTable = (d) => {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    return `${FormatDayMonth(d.getDate())}.${FormatDayMonth(d.getMonth() + 1)}.${d.getFullYear()}`
}