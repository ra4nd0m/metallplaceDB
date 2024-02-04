const docx = require("docx");
const rootDir = process.cwd();

module.exports.rootDir = rootDir;
module.exports.staticDir = rootDir + '/static';
module.exports.TableCellMarginNil = {top: 0, left: 0, bottom: 0, right: 0, marginUnitType: docx.WidthType.NIL};
module.exports.SpacingDefault = 2500;
module.exports.ThinBorder = {size: 0.5 * 8 , color: "#eb612b", style: docx.BorderStyle.SINGLE}
module.exports.FatBorder = {size: 3 * 8 , color: "#eb612b", style: docx.BorderStyle.SINGLE}
module.exports.TocFatBorder = {size: 1.5 * 8 , color: "#eb612b", style: docx.BorderStyle.SINGLE}
module.exports.TocThinBorder = {size: 0.75 * 8 , color: "#eb612b", style: docx.BorderStyle.SINGLE}
module.exports.HeaderSideMargin = 6*20
module.exports.HeaderFontSize = 12 * 2
module.exports.BordersNil = {
    top: {style: docx.BorderStyle.NONE, size: 0, color: "#FFFFFF"},
    bottom: {style: docx.BorderStyle.NONE, size: 0, color: "#FFFFFF"},
    left: {style: docx.BorderStyle.NONE, size: 0, color: "#FFFFFF"},
    right: {style: docx.BorderStyle.NONE, size: 0, color: "#FFFFFF"},
}
module.exports.BorderNil = {style: docx.BorderStyle.NONE, size: 0, color: "#FFFFFF"}
module.exports.FontFamily = "Montserrat";
module.exports.FontFamilyExtraBold = "Montserrat ExtraBold";
module.exports.FontFamilyLight = "Montserrat Light";
module.exports.FontFamilySemiBold = "Montserrat SemiBold";
module.exports.FontFamilyBold = "Montserrat Bold";
module.exports.FontFamilyMedium = "Montserrat Medium";
module.exports.FontFamilyThin = "Montserrat, Thin";
module.exports.HeaderTitle = "Обзор рынка сырья, стали и ферросплавов";
module.exports.ShortHeaderTitle = "Мировой рынок металлургического сырья"
module.exports.RusMonth = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
module.exports.RusMonthStraight = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
module.exports.LineWidth = 20;

module.exports.LineColor = "#d3d3d3";
module.exports.MinPriceId = 2;
module.exports.MaxPriceId = 3;
module.exports.MedPriceId = 1;
module.exports.MonthPredictId = 4
module.exports.WeekPredictId = 5
module.exports.StockId = 6;
module.exports.LabelOffset = 5;
module.exports.PageWidth = 210;
module.exports.FirstLineLength = 18;
module.exports.Green = '#94bc54'
module.exports.Red = "#ec5c24"
module.exports.Grey = "#747474"
module.exports.ColorDefault = "#000000"
module.exports.FontSizeTd = 9 * 2
module.exports.FontSizeTdMicro = 6.5 * 2
module.exports.FontSizeTh = 18
module.exports.FontSizeThMain = 10.5 * 2
module.exports.FontSizeThSecondary = 8 * 2
module.exports.FontSizeThExtraInfo = 7.5 * 2
module.exports.FontSizeCoverPrimary = 45 * 2
module.exports.FontSizeCoverSecondary = 18 * 2
module.exports.FontSizeInfoRow = 14
module.exports.FontSizeHeading3 = 24
module.exports.FontSizeParagraph = 9 * 2
module.exports.HeadingColor = "#2E74B5"
module.exports.h2Size = 22 * 2
module.exports.h2Color = '#F77647'
module.exports.AccentColor2 = '#F77647'
module.exports.AccentColor = '#eb612b'
module.exports.h3Color = '#8ab440'
module.exports.h3Size = 15 * 2
module.exports.SideMargin = docx.convertMillimetersToTwip(this.FirstLineLength)
module.exports.HeaderBackgroundColor = `rgb(200,200,200)`
module.exports.HeaderFooterMargin = 40
module.exports.ApiEndpoint = `http://${process.env.HTTP_HOST}:${process.env.MPLBASE_INTERNAL_HTTP_PORT}`
module.exports.PageMargins = {
    top: 400,
    right: 800,
    left: 800,
}
module.exports.PageZeroMargins = {
    top: 0,
    right: 0,
    left: 0,
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
