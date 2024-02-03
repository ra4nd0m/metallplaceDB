const docx = require("docx");
const {TocFatBorder, TocThinBorder, FontFamilyExtraBold, BorderNil, FontFamilyMedium, BordersNil} = require("../const");
const {ta} = require("date-fns/locale");
const margins = require("./margins");
const paragraph = require("./paragraph");
const disclaimer = require("../atom/disclaimer")

module.exports = function() {
    return [
        margins([tocBlock(["Краткая сводка новостей"])]),
        margins([tocBlock(["Краткая сводка цен по мировому рынку"])]),
        margins([tocBlock(["Рынок сырьевых материалов", "Железорудное сырье", "Уголь и кокс", "Лом черных металлов", "Чугун"])]),
        margins([tocBlock(["Рынок стали", "Полуфабрикаты", "Сортовой прокат", "Плоский прокат"])]),
        margins([tocBlock(["Рынок ферросплавов и руд", "Ферромарганец и силикомарганец", "Ферросилиций", "Феррохром ", "Марганцевая руда", "Хромовая руда"])]),
        margins([tocBlock(["Рынок графитированных электродов"])]),
    ]
}

function tocBlock(lines)
{

    let block = []
    block.push(
        new docx.Table({
            columnWidths: [15, 1],
            width: {
                type: docx.WidthType.PERCENTAGE,
                size: 100
            },
            rows: [
                new docx.TableRow({
                    children: [
                        new docx.TableCell({
                            borders: {top: TocFatBorder, bottom: TocFatBorder, left: TocFatBorder, right: BorderNil},
                            children: [
                                new docx.Paragraph({
                                    children: [
                                        new docx.TextRun({
                                            text: lines[0],
                                            font: FontFamilyExtraBold,
                                            size: 24
                                        })
                                    ]
                                })
                            ]
                        }),
                        new docx.TableCell({
                            borders: {top: TocFatBorder, bottom: TocFatBorder, left: BorderNil, right: TocFatBorder},
                            children: [
                                new docx.Paragraph({
                                    alignment: docx.AlignmentType.RIGHT,
                                    children: [
                                        new docx.TextRun({
                                            text: " ",
                                            font: FontFamilyExtraBold,
                                            size: 24
                                        })
                                    ]
                                })
                            ]
                        }),
                    ]
                })
            ]
        })
    )

    if (lines.length > 1) {
        let rows = []
        let borders = {top: BorderNil, bottom: TocThinBorder, left: BorderNil, right: BorderNil}
        for (let i = 1; i < lines.length; i++) {
            if (i === lines.length - 1) {
                borders = BordersNil
            }
            rows.push(
                new docx.TableRow({
                    children: [
                        new docx.TableCell({
                            borders: borders,
                            children: [
                                new docx.Paragraph({
                                    children: [
                                        new docx.TextRun({
                                            text: lines[i],
                                            font: FontFamilyMedium,
                                            size: 24
                                        })
                                    ]
                                })

                            ]
                        }),
                        new docx.TableCell({
                            borders: borders,
                            children: [
                                new docx.Paragraph({
                                    alignment: docx.AlignmentType.RIGHT,
                                    children: [
                                        new docx.TextRun({
                                            text: " ",
                                            font: FontFamilyMedium,
                                            size: 24
                                        })
                                    ]
                                })

                            ]
                        })
                    ]
                })
            )
        }
        let body = new docx.Table({
            columnWidths: [15, 1],
            width: {
                type: docx.WidthType.PERCENTAGE,
                size: 100
            },
            rows: rows
        })
        block.push(body)
    }



    return paragraph({
        margins: {
            bottom: docx.convertMillimetersToTwip(10)
        },
        children: block
    })
}