package service

import (
	"bytes"
	"errors"
	"fmt"
	"html/template"
	"io/ioutil"
	"metallplace/internal/pkg/genpdf"
	"os"
)

const prefix = "./var/cache/reports/"

func (s *Service) GetReport(date string) ([]byte, error) {
	charts := struct {
		Chart1 string
	}{
		Chart1: s.cfg.HttpHost + ":" + s.cfg.HttpPort + "/getChart/4043_1_11-01-2021_01-01-2022_0.png",
	}
	path := prefix + "report" + date + ".pdf"

	var b bytes.Buffer
	tmpl := []string{
		"./internal/app/model/report_tmpl.html",
	}

	t := template.Must(template.New("report_tmpl.html").ParseFiles(tmpl...))
	err := t.Execute(&b, charts)
	if err != nil {
		return nil, fmt.Errorf("cant generate html from tmpl: %w", err)
	}

	err = genpdf.GetPDFFromHTML(b, path)
	if err != nil {
		return nil, fmt.Errorf("cant convert html to pdf: %w", err)
	}

	return ioutil.ReadFile(path)
}

func (s *Service) GetCachedReport(date string) ([]byte, error) {
	path := prefix + "report" + date + ".pdf"
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		fmt.Println("REPORT NOT FOUND")
		bytes, err := s.GetReport(date)
		if err != nil {
			return nil, fmt.Errorf("cant get generated report bytes: %w", err)
		}

		f, err := os.Create(path)
		if err != nil {
			return nil, fmt.Errorf("cant create file for report: %w", err)
		}

		_, err = f.Write(bytes)
		if err != nil {
			return nil, fmt.Errorf("cant cant write report to file: %w", err)
		}

		f.Close()
		return bytes, nil
	}

	return ioutil.ReadFile(path)
}
