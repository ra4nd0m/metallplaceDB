package model

type MaterialCoordinates struct {
	Material []string `json:"material"`
	Sheet    string   `json:"sheet"`
	Row      int      `json:"row"`
}

type RosStatBook struct {
	MaterialCoordinates []MaterialCoordinates `json:"material_coordinates"`
}

var RosStatBookTypes = map[int]RosStatBook{
	2021: {
		[]MaterialCoordinates{
			{Sheet: "Н-П_24", Row: 56, Material: []string{"Ферромолибден"}},
			{Sheet: "Н-П_24", Row: 64, Material: []string{"Феррованадий"}},
		},
	},
	2022: {
		[]MaterialCoordinates{
			{Sheet: "Н-П_24", Row: 56, Material: []string{"Ферромолибден"}},
			{Sheet: "Н-П_24", Row: 63, Material: []string{"Феррованадий"}},
		},
	},
	2023: {
		[]MaterialCoordinates{
			{Sheet: "Н-П_24", Row: 59, Material: []string{"Ферромолибден"}},
			{Sheet: "Н-П_24", Row: 65, Material: []string{"Феррованадий"}},
		},
	},
}
