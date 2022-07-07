package handler

import (
	"net/http"
)

type InitImportResponse struct {
	Success bool `json:"success"`
}

func (h Handler) InitImport(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(_ any) (AddUniqueMaterialResponse, error) {
		err := h.service.InitialImport(r.Context())
		if err != nil {
			return AddUniqueMaterialResponse{false}, err
		}
		return AddUniqueMaterialResponse{true}, err
	})
}
