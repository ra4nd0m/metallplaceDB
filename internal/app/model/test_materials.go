package model

var TestMaterials = []Material{
	{
		"Material 1",
		"group1",
		"Website 1",
		"Global",
		"FOB",
		"usd/t",
		"A",
		[]Property{
			{"sheet", "med_price", "C", 2, "decimal"},
		},
	},

	{
		"Material 2",
		"group2",
		"Website 2",
		"Global",
		"CNF",
		"usd/t",
		"A",
		[]Property{{"sheet", "min_price", "F", 2, "decimal"},
			{"sheet", "max_price", "G", 2, "decimal"},
			{"sheet", "med_price", "H", 2, "decimal"},
		},
	},
}
