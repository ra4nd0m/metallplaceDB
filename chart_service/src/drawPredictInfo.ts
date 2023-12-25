import {createCanvas, loadImage} from "canvas";
import {getFullRuMonth} from "./dateOperations";
import {PredictLabelInfo} from "./model";

export async function drawPredictInfo(imageBuffer: Buffer, dateStr: string, labels: PredictLabelInfo[]): Promise<Buffer> {
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.globalAlpha = 0.4;
    // Draw text centered by the line width
    ctx.font = '35px Montserrat Semibold';
    let textWidth = ctx.measureText("Прогноз").width;
    let textX = (image.width - (image.width / 7)) - (textWidth / 2);
    let textY = image.height * 0.20;
    ctx.fillText("Прогноз", textX, textY);


    // Add a line under the text
    const lineHeight = 5;
    const linePadding = 130; // Adjust the padding as needed
    const lineLength = textWidth + 2 * linePadding; // Adjust the length of the line as needed
    const lineX = textX - linePadding; // Adjust the position of the line as needed
    const lineY = textY + 10; // Adjust the position of the line as needed
    ctx.fillRect(lineX, lineY, lineLength, lineHeight);

    // Add small vertical notches at the ends of the line
    const notchHeight = 10;
    const notchWidth = 3;
    ctx.fillRect(lineX, lineY - notchHeight, notchWidth, notchHeight); // Top notch
    ctx.fillRect(lineX, lineY + lineHeight, notchWidth, notchHeight); // Bottom notch
    ctx.fillRect(lineX + lineLength - notchWidth, lineY - notchHeight, notchWidth, notchHeight); // Top notch
    ctx.fillRect(lineX + lineLength - notchWidth, lineY + lineHeight, notchWidth, notchHeight); // Bottom notch

    let newText = `Точность прогноза за ${getFullRuMonth(dateStr)}:`
    ctx.font = '25px Montserrat Semibold';
    textWidth = ctx.measureText(newText).width;
    textX = (image.width - (image.width / 7)) - (textWidth / 2);
    textY = image.height * 0.06;
    ctx.fillText(newText, textX, textY);
    let predictLabelsCnt = 1
    ctx.font = '20px Montserrat Semibold';
    labels.forEach(label => {
        let text = `${label.material} - ${label.accuracy}%`
        let textHeight = ctx.measureText(text).actualBoundingBoxAscent +  ctx.measureText(text).actualBoundingBoxDescent
        let labelY = textY + (textHeight + 5) * predictLabelsCnt
        let labelX = textX
        ctx.fillText(text, labelX, labelY);
        predictLabelsCnt++
    })


    // Convert the canvas to a buffer
    return canvas.toBuffer();
}