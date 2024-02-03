const margins = require("./margins");
const docx = require("docx");
const {FontFamilyThin, FontFamilyMedium, FontFamilyExtraBold, AccentColor} = require("../const");


module.exports = function () {
    return margins(
            [
                new docx.Paragraph({
                    alignment: docx.AlignmentType.BOTH,
                    children: [
                        new docx.TextRun({
                            text: "Дисклеймер: ",
                            font: FontFamilyExtraBold,
                            color: AccentColor
                        }),

                        new docx.TextRun({
                            text: "Информация, представленная на портале ",
                            font: FontFamilyMedium,
                        }),
                        new docx.TextRun({
                            text: "metallplace.ru ",
                            font: FontFamilyExtraBold,
                        }),
                        new docx.TextRun({
                            text: "предназначена только для справки и" +
                                "не предназначена для торговых целей или для удовлетворения ваших конкретных требований. Контент " +
                                "включает факты, взгляды и мнения отдельных лиц, а не веб-сайта или его руководства.",
                            font: FontFamilyMedium,
                        }),
                    ]
                }),
                new docx.Paragraph({children: [new docx.TextRun({text: ""})]}),
                new docx.Paragraph({
                    alignment: docx.AlignmentType.BOTH,
                    children: [
                        new docx.TextRun({
                            text: "Пользователи/посетители должны принимать собственные решения на основе собственных независимых " +
                                "запросов, оценок, суждений и рисков. Портал ",
                            font: FontFamilyMedium,
                        }),
                        new docx.TextRun({
                            text: "metallplace.ru ",
                            font: FontFamilyExtraBold,
                        }),
                        new docx.TextRun({
                            text: "не несет ответственность за какие-либо убытки, " +
                                "затраты или действия, возникающие в результате использования распространяемых цен.",
                            font: FontFamilyMedium,
                        })
                    ]
                })
            ]
        )
}