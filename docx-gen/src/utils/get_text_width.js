const {createCanvas} = require("canvas");

module.exports = function getTextWidthInMm(text, fontSize, fontFamily) {
    // Create a virtual canvas
    const canvas = createCanvas(700, 700);
    const context = canvas.getContext('2d');

    // Set the font properties
    context.font = fontSize + 'px ' + fontFamily;

    // Measure the width of the text
    const textWidth = context.measureText(text).width;

    // Convert the width to millimeters (assuming 96 dpi)
    const widthInMm = textWidth * 25.4 / 96;

    // Return the result
    return widthInMm * 0.76;
}