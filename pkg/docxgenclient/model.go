package docxgenclient

import "time"

type Request struct {
	ReportType string `json:"report_type"`
	Date       string `json:"date"`
}

type RequestShortReport struct {
	Date   time.Time `json:"date"`
	Blocks []Block   `json:"blocks"`
}

type Block struct {
	Title string   `json:"title"`
	Text  []string `json:"text"`
	Chart []byte   `json:"chart"`
}
