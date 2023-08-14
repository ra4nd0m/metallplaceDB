package model

var InitDaily = []DailyMaterial{
	{
		"ПВЖ (80% Feмет)",
		"Сырьевые материалы",
		"steelmint.com",
		"Дургапур (Индия)",
		"DAP",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "BM", 4, "decimal", ""},
		},
		false,
		ConvSettings{},
	},
	{
		"Рулон г/к (2,5 мм; SAE1006)",
		"Сталь",
		"steelmint.com",
		"Восточное побережье (Индия)",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "DQ", 6, "decimal", ""},
			{"Daily", "Мин цена", "DO", 6, "decimal", ""},
			{"Daily", "Макс цена", "DP", 6, "decimal", ""},
		},
		false,
		ConvSettings{},
	},
	{
		"Рулон х/к (0,9 мм, IS 513 Gr.O)",
		"Cталь",
		"steelmint.com",
		"Восточное побережье (Индия)",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Мин цена", "ER", 4, "decimal", ""},
			{"Daily", "Макс цена", "ES", 4, "decimal", ""},
			{"Daily", "Средняя цена", "ET", 4, "decimal", ""},
		},
		false,
		ConvSettings{},
	},
	{
		"FeSi (75% Si)",
		"Cталь",
		"ferroalloynet.com",
		"Внутренняя Монголия (Китай)",
		"EXW",
		"¥/т",
		"A",
		[]Property{
			{"Daily", "Мин цена", "GD", 4, "decimal", ""},
			{"Daily", "Макс цена", "GE", 4, "decimal", ""},
			{"Daily", "Средняя цена", "GF", 4, "decimal", ""},
		},
		false,
		ConvSettings{},
	},
	{
		"FeSi (75% Si)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Таншань (Китай)",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "GO", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"FeSi (75% Si)",
		"Ферросплавы и руды",
		"crugroup.com",
		"(США)",
		"EXW",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "HG", 4, "decimal", ""},
		},
		true,
		ConvSettings{
			true,
			UsdcPoundToUsdTonn,
			75,
		},
	},
	{
		"SiMn (65% Si; 17% Mn)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Гуанси (Китай)",
		"EXW",
		"¥/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "HQ", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"SiMn (65% Si; 16% Mn)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Вишакхапатнам (Индия)",
		"FOB",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "HZ", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"SiMn (65% Mn)",
		"Ферросплавы и руды",
		"crugroup.com",
		"(США)",
		"EXW",
		"$/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "II", 4, "decimal", ""},
		},
		true,
		ConvSettings{
			true,
			UsdcPoundToUsdTonn,
			100,
		},
	},
	{
		"FeCr HC (55% Cr; 10% C)",
		"Ферросплавы и руды",
		"crugroup.com",
		"Внутренняя Монголия (Китай)",
		"EXW",
		"¥/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "JT", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"FeCr HC (Казахстан; 70% Cr; 0,5% Si)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Таншань (Китай)",
		"CIF",
		"¢/фунт Cr",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "KC", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"FeCr HC (Индия; 60% Cr; 4% Si)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Таншань (Китай)",
		"CIF",
		"¢/фунт Cr",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "KL", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"FeCr HC (ЮАР; 48-50% Cr; 5% Si)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Таншань (Китай)",
		"CIF",
		"¢/фунт Cr",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "KU", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"FeCr LC (52-60% Cr; 0,25% C)",
		"Ферросплавы и руды",
		"ferroalloynet.com",
		"Внутренняя Монголия (Китай)",
		"EXW",
		"¥/т",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "LM", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
	{
		"FeCr LC (0,1% C)",
		"Ферросплавы и руды",
		"crugroup.com",
		"(США)",
		"EXW",
		"¢/фунт Cr",
		"A",
		[]Property{
			{"Daily", "Средняя цена", "ME", 4, "decimal", ""},
		},
		true,
		ConvSettings{},
	},
}

func UsdcPoundToUsdTonn(num float64, rate float64) float64 {
	return (num / 100) / 0.00045 * (rate / 100)
}
