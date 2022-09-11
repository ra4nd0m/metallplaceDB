const docx = require("docx");
const {GetWeekNumber} = require("./utils/date_operations")

const RusMonth = ["января","фервраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]

module.exports.TableCellMarginNil = {top: 0, left: 0, bottom: 0, right: 0, marginUnitType: docx.WidthType.NIL};
module.exports.SpacingDefault =2500;
module.exports.FontFamily = "Arial";
module.exports.HeaderTitle = "Обзор рынка сырья, стали и ферросплавов";
module.exports.RusMonth = RusMonth;
module.exports.LineWidth = 20;
module.exports.LineColor = "d3d3d3";
module.exports.MinPriceId = 3;
module.exports.MaxPriceId = 4;
module.exports.MedPriceId = 2;
module.exports.FooterTitle = function (weekDates){
        return `Отчетный период: ${weekDates.first.day} ${RusMonth[weekDates.first.month]} - `+
            `${weekDates.last.day} ${RusMonth[weekDates.last.month]} ${weekDates.last.year} года (${GetWeekNumber()} неделя)`
    }
const NONE_BORDER = {
    style: docx.BorderStyle.NONE,
    size: 0,
    color: "auto",
};
module.exports.TableNoOuterBorders = {
    top: NONE_BORDER,
    bottom: NONE_BORDER,
    left: NONE_BORDER,
    right: NONE_BORDER,
};

