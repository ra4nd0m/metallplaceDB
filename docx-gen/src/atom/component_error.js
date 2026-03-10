const docx = require("docx");
const { FontFamily, FatBorder, ThinBorder, BorderNil } = require("../const");
const margins = require("./margins");

/**
 * Returns a docx element (compatible with what components return via margins())
 * displaying a visible error message in place of the failed component.
 *
 * @param {string} message - Human-readable description of what went wrong
 */
module.exports = function componentError(message) {
    console.error(`[component_error] Rendering placeholder: ${message}`);
    return margins([
        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: `⚠ Данные недоступны: ${message}`,
                    font: FontFamily,
                    color: "CC0000",
                    size: 20,
                }),
            ],
            border: {
                top: FatBorder,
                bottom: FatBorder,
                left: BorderNil,
                right: BorderNil,
            },
        }),
    ]);
};
