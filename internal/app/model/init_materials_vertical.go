package model

var InitMaterialsVertical = []Material{
	{"01.ЖРС",
		"ЖРС, 62% Fe",
		"ferroalloynet.com",
		"Китай",
		"CNF",
		"$/т",
		"A",
		[]Property{{"Средняя цена", "E", 3, "decimal"}},
	},

	{"01.ЖРС",
		"ЖРС, 65% Fe",
		"ferroalloynet.com",
		"Китай",
		"CNF",
		"$/т",
		"A",
		[]Property{{"Средняя цена", "L", 3, "decimal"}},
	},

	{"02.Лом",
		"Лом 3A",
		"-",
		"Урал",
		"CPT",
		"₽/т",
		"A",
		[]Property{
			{"Мин цена", "D", 3, "decimal"},
			{"Макс цена", "E", 3, "decimal"},
			{"Средняя цена", "F", 3, "decimal"},
		},
	},

	{"02.Лом",
		"Лом HMS 1&2 (80:20)",
		"-",
		"Турция",
		"CNF",
		"$/т",
		"A",
		[]Property{
			{"Средняя цена", "L", 3, "decimal"},
		},
	},

	{"03.Чугун",
		"Чугун (передельный)",
		"steelmint.com",
		"Черное море",
		"CNF",
		"$/т",
		"B",
		[]Property{
			{"Мин цена", "D", 159, "decimal"},
			{"Макс цена", "E", 159, "decimal"},
			{"Средняя цена", "F", 3, "decimal"},
		},
	},

	{"04.Уголь",
		"Кокс. уголь (Австралия)",
		"mysteel.net",
		"Китай",
		"CFR",
		"$/т",
		"A",
		[]Property{
			{"Средняя цена", "E", 3, "decimal"},
		},
	},

	{"04.Уголь",
		"Кокс. уголь (Россия)",
		"mysteel.net",
		"Китай",
		"CFR",
		"$/т",
		"A",
		[]Property{
			{"Средняя цена", "L", 303, "decimal"},
		},
	},

	{"05.Мет. кокс",
		"Металлургический кокс (64% CRS)",
		"steelmint.com",
		"Китай",
		"FOB",
		"$/т",
		"B",
		[]Property{
			{"Средняя цена", "F", 3, "decimal"},
		},
	},

	{"06.Сталь",
		"Заготовка",
		"steelmint.com",
		"Черное море",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "D", 159, "decimal"},
			{"Макс цена", "E", 159, "decimal"},
			{"Средняя цена", "F", 3, "decimal"},
		},
	},

	{"06.Сталь",
		"Арматура (12-25 мм)",
		"-",
		"Черное море",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "J", 159, "decimal"},
			{"Макс цена", "K", 159, "decimal"},
			{"Средняя цена", "L", 3, "decimal"},
		},
	},

	{"06.Сталь",
		"Сляб",
		"-",
		"Черное море",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "P", 203, "decimal"},
			{"Макс цена", "Q", 203, "decimal"},
			{"Средняя цена", "R", 3, "decimal"},
		},
	},

	{"06.Сталь",
		"Рулон г/к",
		"steelmint.com",
		"Черное море",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "V", 159, "decimal"},
			{"Макс цена", "W", 159, "decimal"},
			{"Средняя цена", "X", 3, "decimal"},
		},
	},

	{"06.Сталь",
		"Рулон х/к",
		"steelmint.com",
		"Черное море",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "AB", 203, "decimal"},
			{"Макс цена", "AC", 203, "decimal"},
			{"Средняя цена", "AD", 3, "decimal"},
		},
	},

	{"06.Сталь",
		"Арматура A1 (без НДС)",
		"-",
		"Россия",
		"EXW",
		"₽/т",
		"A",
		[]Property{
			{"Средняя цена", "AJ", 212, "decimal"},
		},
	},

	{"06.Сталь",
		"Рулон г/к",
		"steelmint.com",
		"Россия",
		"EXW",
		"₽/т",
		"A",
		[]Property{
			{"Средняя цена", "AP", 212, "decimal"},
		},
	},

	{"06.Сталь",
		"Рулон х/к",
		"steelmint.com",
		"Россия",
		"EXW",
		"₽/т",
		"A",
		[]Property{
			{"Средняя цена", "AV", 213, "decimal"},
		},
	},

	{"07.ФС (М)",
		"FeMn HC; 76% Mn",
		"-",
		"Европа",
		"DDP",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "D", 11, "decimal"},
			{"Макс цена", "E", 11, "decimal"},
			{"Средняя цена", "F", 3, "decimal"},
		},
	},

	{"07.ФС (М)",
		"FeSi 75% Si",
		"-",
		"Европа",
		"DDP",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "K", 11, "decimal"},
			{"Макс цена", "L", 11, "decimal"},
			{"Средняя цена", "M", 3, "decimal"},
		},
	},

	{"07.ФС (М)",
		"SiMn 65% Mn; 17% Si",
		"-",
		"Европа",
		"DDP",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "R", 11, "decimal"},
			{"Макс цена", "S", 11, "decimal"},
			{"Средняя цена", "T", 3, "decimal"},
		},
	},

	{"07.ФС (М)",
		"FeCr HC; 62-70% Cr",
		"-",
		"Европа",
		"DDP",
		"¢/фунт",
		"A",
		[]Property{
			{"Мин цена", "Y", 11, "decimal"},
			{"Макс цена", "Z", 11, "decimal"},
			{"Средняя цена", "AA", 3, "decimal"},
		},
	},

	{"07.ФС (М)",
		"FeCr LC; 0,1% Cr",
		"-",
		"Европа",
		"DDP",
		"¢/фунт",
		"A",
		[]Property{
			{"Мин цена", "AF", 11, "decimal"},
			{"Макс цена", "AG", 11, "decimal"},
			{"Средняя цена", "AH", 3, "decimal"},
		},
	},

	{"07.ФС (М)",
		"Mn руда кусковая; 36-38% Mn",
		"-",
		"Китай",
		"CIF",
		"$/1% Mn смт",
		"A",
		[]Property{
			{"Мин цена", "AM", 11, "decimal"},
			{"Макс цена", "AN", 11, "decimal"},
			{"Средняя цена", "AO", 3, "decimal"},
		},
	},

	{"07.ФС (М)",
		"Cr руда кусоквая; 42% Cr",
		"-",
		"Китай",
		"CIF",
		"$/т",
		"A",
		[]Property{
			{"Мин цена", "AT", 11, "decimal"},
			{"Макс цена", "AU", 11, "decimal"},
			{"Средняя цена", "AV", 3, "decimal"},
		},
	},

	{"08.ГЭ",
		"Графитированные электроды HP; 450 мм",
		"-",
		"Китай",
		"EXW",
		"$/т",
		"A",
		[]Property{
			{"Средняя цена", "F", 212, "decimal"},
		},
	},

	{"08.ГЭ",
		"Графитированные электроды UHP; 600 мм",
		"-",
		"Китай",
		"EXW",
		"$/т",
		"A",
		[]Property{
			{"Средняя цена", "L", 212, "decimal"},
		},
	},

	{"09.Запасы",
		"Запасы Mn руд в портах Китая",
		"-",
		"",
		"",
		"млн тонн",
		"B",
		[]Property{
			{"Запас", "F", 3, "decimal"},
		},
	},

	{"09.Запасы",
		"Запасы Cr руд в портах Китая",
		"-",
		"",
		"",
		"млн тонн",
		"B",
		[]Property{
			{"Запас", "L", 3, "decimal"},
		},
	},

	{"09.Запасы",
		"Запасы железной руды в портах Китая",
		"-",
		"",
		"",
		"млн тонн",
		"B",
		[]Property{
			{"Запас", "R", 3, "decimal"},
		},
	},
}
