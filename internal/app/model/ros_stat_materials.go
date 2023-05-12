package model

type MaterialCoordinates struct {
	Material []string `json:"material"`
	Sheet    string   `json:"sheet"`
	Row      int      `json:"row"`
}

var RosStatCoordinates = []MaterialCoordinates{
	{Sheet: "Н-П_24", Row: 56, Material: []string{"Ферромолибден"}},
	{Sheet: "Н-П_24", Row: 64, Material: []string{"Феррованадий"}},
	{Sheet: "Н-П_24", Row: 49, Material: []string{"Ферросилиций"}},
	{Sheet: "Н-П_24", Row: 91, Material: []string{"Ферромарганец"}},
	{Sheet: "Н-П_24", Row: 85, Material: []string{"Ферросиликомарганец"}},
	{Sheet: "Н-П_24", Row: 75, Material: []string{"Феррохром"}},
	{Sheet: "Н-П_24", Row: 81, Material: []string{"Ферросиликохром"}},
}
