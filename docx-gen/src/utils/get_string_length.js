const pixelWidth = require("string-pixel-width");
module.exports = function (str, fontSize, dpi) {
    const pixelWidthValue = pixelWidth(str, { size: fontSize });
    return (pixelWidthValue / dpi) * 25.4;
}