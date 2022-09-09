const docx = require("docx");
const text = require("../atom/text")
const paragraph = require("../atom/paragraph")
const axios = require("axios");

module.exports = async function singleTable(materialId, propertyId, n){

    const resMat = await axios.post("http://localhost:8080/getMaterialInfo",  { id: materialId })
    const feed = await axios.post("http://localhost:8080/getNLastValues", { material_source_id: materialId, property_id: propertyId, n_values:n})
    return new docx.Table({
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE,
        },
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        rowSpan: 2,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Дата")]
                            })
                        ]
                    }),
                    new  docx.TableCell({
                        columnSpan: 3,
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text(resMat.data.info.Name)]
                            })
                        ]
                    })
                ]
            }),
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Цена")]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text(`Изм. ${resMat.data.info.Unit}`)]
                            })
                        ]
                    }),
                    new docx.TableCell({
                        children: [
                            paragraph({
                                alignment: docx.AlignmentType.CENTER,
                                children: [text("Изм. %")]
                            })
                        ]
                    }),
                ]
            }),
            //...tableBody(feed.data.price_feed),
        ]
    })
}