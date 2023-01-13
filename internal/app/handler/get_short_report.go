package handler

import (
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
	"time"
)

type Block struct {
	Title     string   `json:"title"`
	Text      []string `json:"text"`
	ExcelFile []byte   `json:"excel_file"`
}

type GetShortRequestRequest struct {
	Date   string  `json:"date"`
	Blocks []Block `json:"blocks"`
}
type GetShortRequestResponse struct{}

func (h Handler) GetShortReportHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetShortRequestRequest) (GetShortRequestResponse, error) {

		var reportBlocks []model.ReportBlock
		for _, reqBlock := range req.Blocks {
			chartBytes, err := h.service.GetChartRaw(reqBlock.ExcelFile, 10000)
			if err != nil {
				return GetShortRequestResponse{}, err
			}
			reportBlocks = append(reportBlocks, model.ReportBlock{Title: reqBlock.Title, Text: reqBlock.Text, Chart: chartBytes})
		}
		fmt.Println(reportBlocks)
		date, err := time.Parse(req.Date, "2006-01-02")
		if err != nil {
			return GetShortRequestResponse{}, fmt.Errorf("cant parse date: %w", err)
		}
		bytes, err := h.service.GetShortReport(date, reportBlocks)
		w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

		_, _ = w.Write(bytes)
		return GetShortRequestResponse{}, nil
	})
}
