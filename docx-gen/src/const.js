const docx = require("docx");
const rootDir = process.cwd();

module.exports.rootDir = rootDir;
module.exports.staticDir = rootDir + '/src/static';
module.exports.TableCellMarginNil = {top: 0, left: 0, bottom: 0, right: 0, marginUnitType: docx.WidthType.NIL};
module.exports.SpacingDefault = 2500;
module.exports.FontFamily = "Montserrat";
module.exports.FontFamilyExtraBold = "Montserrat ExtraBold";
module.exports.FontFamilySemiBold = "Montserrat SemiBold";
module.exports.FontFamilyBold = "Montserrat SemiBold";
module.exports.FontFamilyMedium = "Montserrat Medium";
module.exports.FontFamilyThin = "Montserrat";
module.exports.WeeklyHeaderTitle = "Обзор рынка сырья, стали и ферросплавов";
module.exports.MonthlyHeaderTitle = "Обзор рынка сырья и стали";
module.exports.ShortHeaderTitle = "Мировой рынок металлургического сырья: итоги "
module.exports.RusMonth = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
module.exports.RusMonthStraight = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
module.exports.LineWidth = 20;
module.exports.LineColor = "#d3d3d3";
module.exports.MinPriceId = 2;
module.exports.MaxPriceId = 3;
module.exports.MedPriceId = 1;
module.exports.MonthPredictId = 5
module.exports.WeekPredictId = 6
module.exports.StockId = 4;
module.exports.LabelOffset = 5;
module.exports.Green = '#88b707'
module.exports.Red = "#EA3323"
module.exports.ColorDefault = "#000000"
module.exports.FontSizeTd = 9 * 2
module.exports.FontSizeTdMicro = 6.5 * 2
module.exports.FontSizeTh = 18
module.exports.FontSizeThMain = 10.5 * 2
module.exports.FontSizeThSecondary = 9.5 * 2
module.exports.FontSizeThExtraInfo = 8 * 2
module.exports.FontSizeCover = 30 * 2
module.exports.FontSizeInfoRow = 14
module.exports.FontSizeHeading3 = 24
module.exports.FontSizeParagraph = 9 * 2
module.exports.HeadingColor = "#2E74B5"
module.exports.h2Size = 16 * 2
module.exports.h2Color = '#F77647'
module.exports.h3Size = 14 * 2
module.exports.h3Color = '#8ab440'
module.exports.mainServerPort = 8080
module.exports.HeaderBackgroundColor = `rgb(200,200,200)`
module.exports.HeaderFooterMargin = 40
module.exports.PageMargins = {
    top: 400,
    right: 800,
    left: 800,
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
