package model

type Coordinates struct {
	Sheet string `json:"sheet"`
	Row   int    `json:"row"`
}

var RosStatMaterials21 = []Coordinates{
	{Sheet: "Н-П_24", Row: 56},
	{Sheet: "Н-П_24", Row: 64},
}
