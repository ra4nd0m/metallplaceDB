const pixelWidth = require("string-pixel-width");
module.exports = function (str, fontSize, dpi) {
    const pixelWidthValue = pixelWidth(str, { size: fontSize });
    if (str.length > 30) return (pixelWidthValue / dpi) * 25.4 * 0.8;
    return (pixelWidthValue / dpi) * 25.4;
}