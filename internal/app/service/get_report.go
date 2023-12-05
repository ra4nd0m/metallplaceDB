package service

import (
	"errors"
	"fmt"
	"io/ioutil"
	"metallplace/internal/app/model"
	"metallplace/pkg/docxgenclient"
	"os"
	"time"
)

const prefix = "./var/cache/reports/"

func (s *Service) GetReport(repType string, date string) ([]byte, error) {
	bytes, err := s.docxgen.GetReport(docxgenclient.Request{ReportType: repType, Date: date})
	if err != nil {
		return nil, fmt.Errorf("cant get reprot from docxgen service: %w", err)
	}

	//bytes, err = s.modifier.FormatPageNumberFont(bytes)
	//if err != nil {
	//	return nil, fmt.Errorf("cannot format page number font: %w", err)
	//}

	return bytes, nil
}

func (s *Service) GetShortReport(reportHeader string, date time.Time, blocks []model.ReportBlock) ([]byte, error) {
	var req docxgenclient.RequestShortReport
	var reqBlocks []docxgenclient.Block
	for _, b := range blocks {
		reqBlocks = append(reqBlocks, docxgenclient.Block{Title: b.Title, Text: b.Text, Chart: b.Chart})
	}
	req.Date = date
	req.Blocks = reqBlocks
	req.ReportHeader = reportHeader
	bytes, err := s.docxgen.GetShortReport(req)
	if err != nil {
		return nil, fmt.Errorf("cant get short report from docxgen service: %w", err)
	}
	return bytes, nil
}

func (s *Service) GetCachedReport(repType string, date string) ([]byte, error) {
	path := prefix + repType + "/" + date + ".docx"
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		bytes, err := s.GetReport(repType, date)
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
