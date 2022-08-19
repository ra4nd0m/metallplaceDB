package service

import (
	"bytes"
	"html/template"
	"os"
)

func (s *Service) GetReport() string {
	chart := "localhost:8080/chart_service/3_1_2017-01-01_2022-01-01.png"
	prefix := "./var/report/"

	var b bytes.Buffer
	paths := []string{
		"./internal/app/model/report_tmpl.html",
	}

	t := template.Must(template.New("report_tmpl.html").ParseFiles(paths...))
	err := t.Execute(&b, chart)
	if err != nil {
		panic(err)
	}

	file, err := os.Create(prefix + "report.pdf")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	return prefix + "report.pdf"
}
