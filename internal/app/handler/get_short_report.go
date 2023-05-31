package handler

import (
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
	"time"
)

type Block struct {
	Title      string   `json:"title"`
	Paragraphs []string `json:"paragraphs"`
	File       []byte   `json:"file"`
}

type GetShortRequestRequest struct {
	ReportHeader string  `json:"report_header"`
	Date         string  `json:"date"`
	Blocks       []Block `json:"blocks"`
}
type GetShortRequestResponse struct{}

func (h Handler) GetShortReportHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetShortRequestRequest) (GetShortRequestResponse, error) {

		var reportBlocks []model.ReportBlock
		for _, reqBlock := range req.Blocks {
			var chartBytes []byte = nil
			if reqBlock.File != nil {
				var err error
				chartBytes, err = h.service.GetChartRaw(reqBlock.File, 10000)
				if err != nil {
					return GetShortRequestResponse{}, err
				}
			}

			reportBlocks = append(reportBlocks, model.ReportBlock{Title: reqBlock.Title, Text: reqBlock.Paragraphs, Chart: chartBytes})
		}
		fmt.Println(reportBlocks)
		date, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			return GetShortRequestResponse{}, fmt.Errorf("cant parse date: %w", err)
		}
		bytes, err := h.service.GetShortReport(req.ReportHeader, date, reportBlocks)
		w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

		_, _ = w.Write(bytes)
		return GetShortRequestResponse{}, nil
	})
}
