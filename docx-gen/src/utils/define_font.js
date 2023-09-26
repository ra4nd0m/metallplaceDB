const {FontFamilyExtraBold, FontFamily} = require("../const");
module.exports = function(i, feed, type) {
    let font = FontFamily
    if ((i === feed.length - 1 || (i === feed.length - 2 && type !== "month")) && feed.length >= 8) font = FontFamilyExtraBold
    if (i === 4 && feed.length === 5) font = FontFamilyExtraBold
    return font
}