const docx = require("docx");
const {TableCellMarginNil, ThinBorder} = require("../const");
module.exports = function (v, raw){
    if (raw) {
        return new docx.TableCell(v)
    }
   return new docx.TableCell({
       children: v.children,
       margins: TableCellMarginNil,
       verticalAlign: docx.VerticalAlign.CENTER,
       borders: {
           top: ThinBorder,
           bottom: ThinBorder,
           left: ThinBorder,
           right: ThinBorder,
       },
   });
}