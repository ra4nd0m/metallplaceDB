const docx = require("docx");
const {AccentColor, TableCellMarginNil} = require("../const");
module.exports = function (v){

    let cell =  new docx.TableCell(v)

    const borderStyle = {style: docx.BorderStyle.SINGLE, size: 0.5, color: AccentColor}
    cell.borders = {
        top: borderStyle,
        bottom: borderStyle,
        left: borderStyle,
        right: borderStyle,
    }

   return new docx.TableCell({
       children: v.children,
       margins: TableCellMarginNil,
       verticalAlign: docx.VerticalAlign.CENTER,
       borders: {
           top: borderStyle,
           bottom: borderStyle,
           left: borderStyle,
           right: borderStyle,
       },
   });
}