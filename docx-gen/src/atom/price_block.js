const docx = require("docx");
const {TableNoOuterBorders, TableCellMarginNil, FontFamilyMedium, FontSizeThMain, FontFamilyThin, FontSizeThExtraInfo} = require("../const");
const textTh = require("./text_th");
module.exports = function (unit) {
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
                        textTh("Цена", FontFamilyMedium, FontSizeThMain),
                            textTh(unit, FontFamilyThin, FontSizeThExtraInfo)]})
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({margins: TableCellMarginNil,children: [textTh(`мин`, FontFamilyThin, FontSizeThExtraInfo)]}),
                    new docx.TableCell({margins: TableCellMarginNil,children: [textTh(`макс`, FontFamilyThin, FontSizeThExtraInfo)]}),
                    new docx.TableCell({margins: TableCellMarginNil,children: [textTh(`сред`, FontFamilyThin, FontSizeThExtraInfo)]}),
                ]
            })
        ]
    })
}