const {FormatDayMonth} = require("./date_operations");

module.exports.formatDateDb = function(d) {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    return `${d.getFullYear()}-${FormatDayMonth(d.getMonth() + 1)}-${FormatDayMonth(d.getDate())}`
}