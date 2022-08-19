package handler

import (
	"errors"
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
	"os"
)

type GetChartRequest struct {
	FileName string `json:"file_name"`
}

type GetChartResponse struct {
	Path string `json:"path"`
}

func (h Handler) GetChartHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetChartRequest) (GetChartResponse, error) {
		path := "./var/chart_service/" + req.FileName
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			chartPack, err := model.NewChartPack(req.FileName)
			if err != nil {
				return GetChartResponse{}, fmt.Errorf("cant pack request to struct: %w", err)
			}

			_, err = h.service.GetChart(r.Context(), chartPack)
			if err != nil {
				return GetChartResponse{}, fmt.Errorf("cant pack generate chart_service: %w", err)
			}
		}

		return GetChartResponse{Path: path}, nil
	})
}
