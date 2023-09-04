const docx = require("docx");
module.exports = function (v){
    let cell = new docx.TableCell(v)
    cell.options.verticalAlign = docx.VerticalAlign.CENTER
    return new docx.TableCell(v)
}