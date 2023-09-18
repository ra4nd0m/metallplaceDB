const docx = require("docx");
const {TableNoOuterBorders, TableCellMarginNil, FontFamilyMedium, FontSizeThMain, FontFamilyThin, FontSizeThExtraInfo,
    BorderNil,
    FatBorder,
    ThinBorder, BordersNil
} = require("../const");
const textTh = require("./text_th");
module.exports = function (unit, priceFont) {
    if (!priceFont) {
        priceFont = FontFamilyMedium
    }
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,

        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({columnSpan: 3, children: [
                        textTh("Цена", priceFont, FontSizeThMain),
                            textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]})
                ],
                margins: TableCellMarginNil
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({borders:{top: FatBorder, bottom: BorderNil, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil,children: [textTh(`мин`, FontFamilyThin, FontSizeThExtraInfo)]}),
                    new docx.TableCell({borders:{top: FatBorder, bottom: BorderNil, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil,children: [textTh(`макс`, FontFamilyThin, FontSizeThExtraInfo)]}),
                    new docx.TableCell({borders:{top: FatBorder, bottom: BorderNil, left: ThinBorder, right: ThinBorder}, margins: TableCellMarginNil,children: [textTh(`сред`, FontFamilyThin, FontSizeThExtraInfo)]}),
                ]
            })
        ]
    })
}