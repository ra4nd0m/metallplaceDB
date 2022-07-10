package model

var TestMaterials = []Material{
	{"sheet",
		"Material 1",
		"Website 1",
		"Global",
		"usd/t",
		"A",
		[]Property{
			{"med_price", "C", 2, "decimal"},
		},
	},

	{"sheet",
		"Material 2",
		"Website 2",
		"Global",
		"usd/t",
		"A",
		[]Property{{"min_price", "F", 2, "decimal"},
			{"max_price", "G", 2, "decimal"},
			{"med_price", "H", 2, "decimal"},
		},
	},
}
