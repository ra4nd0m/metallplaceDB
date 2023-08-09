package handler

import (
	"net/http"
)

type InitImportRequest struct {
	Group string `json:"group"`
}

type InitImportResponse struct {
	Success bool `json:"success"`
}

func (h Handler) InitImportHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req InitImportRequest) (InitImportResponse, error) {
		if req.Group == "daily" {
			err := h.service.InitialImportDaily(r.Context())
			if err != nil {
				return InitImportResponse{false}, err
			}
			return InitImportResponse{true}, nil
		} else {
			err := h.service.InitialImport(r.Context())
			if err != nil {
				return InitImportResponse{false}, err
			}
			return InitImportResponse{true}, nil
		}

	})
}
