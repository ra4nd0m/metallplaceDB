package handler

import (
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
	"time"
)

// Block example
type Block struct {
	Title      string   `json:"title" example:"Short report title" format:"string"`
	Paragraphs []string `json:"paragraphs" example:"[\"First paragraph\", \"Second paragraph\"]" format:"array"`
	File       []byte   `json:"file"`
}

// GetShortRequestRequest example
type GetShortRequestRequest struct {
	ReportHeader string  `json:"report_header" example:"Short report header" format:"string"`
	Date         string  `json:"date" example:"2006-01-02" format:"string"`
	Blocks       []Block `json:"blocks"`
}
type GetShortRequestResponse struct{}

// GetShortReportHandler godoc
//
//	@Summary		Get non-regular report
//	@Description	get report passing blocks of text and xlsx files in defined format. File field can be empty (or we pass bytes of xlsx file there)
//	@Tags			report
//	@Accept			json
//	@Produce		json
//	@Param request body GetShortRequestRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetShortRequestResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getShortReport [post]
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
		date, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			return GetShortRequestResponse{}, fmt.Errorf("cant parse date: %w", err)
		}
		bytes, err := h.service.GetShortReport(req.ReportHeader, date, reportBlocks)
		if err != nil {
			return GetShortRequestResponse{}, fmt.Errorf("cant get short report: %w", err)
		}
		w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

		_, _ = w.Write(bytes)
		return GetShortRequestResponse{}, nil
	})
}
