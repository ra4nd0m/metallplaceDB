const docx = require("docx");
const paragraph = require("../atom/paragraph");
const paragraphCentred = require("../atom/paragraph_centred");
const text = require("../atom/text");
const {TableCellMarginNil, TableNoOuterBorders} = require("../const");
const axios = require("axios");

const {TableRow, TableCell, Paragraph} = docx;
function headerMaterial(name, unit){
    return  new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        borders: TableNoOuterBorders,
        rows: [
            new TableRow({
                children: [new TableCell({columnSpan: 3, children: [paragraphCentred(name)]})]
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [paragraphCentred("Цена")]}),
                    new TableCell({ children: [paragraphCentred(`Изм. ${unit}`)]}),
                    new TableCell({ children: [paragraphCentred("Изм. %")]}),
                ],
            })
        ]
    })
}

module.exports = async function tableDoubleWithWeekAvg(materialId1, materialId2, propertyId) {
    const resMat1 = await axios.post("http://localhost:8080/getMaterialInfo",  { id: materialId1 })
    const resMat2 = await axios.post("http://localhost:8080/getMaterialInfo",  { id: materialId2 })
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        columnWidths: [4,10,10,4],
        rows:[
            new TableRow({
                children: [
                    new TableCell({ margins: TableCellMarginNil, children: [paragraphCentred("Дата")]}),
                    new TableCell({ margins: TableCellMarginNil, children: [headerMaterial(resMat1.data.info.Name, resMat1.data.info.Unit)]}),
                    new TableCell({ margins: TableCellMarginNil, children: [headerMaterial(resMat2.data.info.Name, resMat2.data.info.Unit)]}),
                    new TableCell({ margins: TableCellMarginNil, children: [paragraphCentred(`Средняя ${resMat1.data.info.Unit}`)]}),
                ],
            })


            // new TableRow({
            //     children: [
            //         new TableCell({children: [new Paragraph("0,0")], rowSpan: 2}),
            //         new TableCell({children: [new Paragraph("0,1")], columnSpan: 3}),
            //         new TableCell({children: [new Paragraph("0,4")], columnSpan: 3}),
            //         new TableCell({children: [new Paragraph("0,7")], rowSpan: 2}),
            //     ],
            // }),
            // new TableRow({
            //     children: [
            //         new TableCell({children: [new Paragraph("1,1")]}),
            //         new TableCell({children: [new Paragraph("1,2")]}),
            //         new TableCell({children: [new Paragraph("1,3")]}),
            //         new TableCell({children: [new Paragraph("1,4")]}),
            //         new TableCell({children: [new Paragraph("1,5")]}),
            //         new TableCell({children: [new Paragraph("1,6")]}),
            //     ],
            // }),

        ]
    })
}