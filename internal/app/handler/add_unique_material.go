package handler

import (
	"net/http"
)

type AddUniqueMaterialRequest struct {
	Name   string `json:"name"`
	Source string `json:"source"`
	Market string `json:"market"`
	Unit   string `json:"unit"`
}

type AddUniqueMaterialResponse struct {
	Success bool `json:"success"`
}

func (h Handler) AddUniqueMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddUniqueMaterialRequest) (AddUniqueMaterialResponse, error) {
		_, err := h.service.AddUniqueMaterial(r.Context(), req.Name, req.Source, req.Market, req.Unit)
		if err != nil {
			return AddUniqueMaterialResponse{false}, err
		}
		return AddUniqueMaterialResponse{true}, err
	})
}
