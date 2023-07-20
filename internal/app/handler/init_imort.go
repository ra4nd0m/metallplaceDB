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
		if req.Group == "" {
			err := h.service.InitialImport(r.Context())
			if err != nil {
				return InitImportResponse{false}, err
			}
		} else if req.Group == "daily" {
			err := h.service.InitImportDailyMaterials(r.Context())
			if err != nil {
				return InitImportResponse{false}, err
			}
		} else {
			return InitImportResponse{true}, nil
		}
		return InitImportResponse{true}, nil
	})
}
