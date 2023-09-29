const {FontFamilyExtraBold, FontFamily} = require("../const");
module.exports = function(i, feed) {
    if (feed.length >= 2){
        if (i === feed.length - 1) {
            return FontFamilyExtraBold
        }
        let dateFirst = new Date(feed[feed.length - 2].date)
        let dateSecond = new Date(feed[feed.length - 1].date)
        let diffInMilliseconds = Math.abs(dateSecond - dateFirst)
        let diff = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
        // if updates 2 time a week - two last rows are bold; if once a week - only the last one
        if (i === feed.length - 2){
            if (diff < 5) {
                return FontFamilyExtraBold
            }
            return FontFamily
        }
    }
    return FontFamily
}