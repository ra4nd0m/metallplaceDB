package model

type ReportBlock struct {
	Title string `json:"title"`
	Text  string `json:"text"`
	Chart []byte `json:"chart"`
}
