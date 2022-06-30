package handler

import (
	"github.com/xuri/excelize/v2"
	"metallplace/internal/app/model"
	"metallplace/internal/service"
	"net/http"
)

type ImportRequest struct {
	Book      *excelize.File   `json:"book"`
	Materials []model.Material `json:"materials"`
}

type ImportResponse struct{}

func ImportHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req ImportRequest) (ImportResponse, error) {
		err := service.InitialProcessBook(r.Context(), req.Book, req.Materials)

		return ImportResponse{}, err
	})
}
