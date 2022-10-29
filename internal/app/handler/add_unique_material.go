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
	Id int `json:"id"`
}

func (h Handler) AddUniqueMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddUniqueMaterialRequest) (AddUniqueMaterialResponse, error) {
		id, err := h.service.AddUniqueMaterial(r.Context(), req.Name, req.Source, req.Market, req.Unit)
		if err != nil {
			return AddUniqueMaterialResponse{0}, err
		}
		return AddUniqueMaterialResponse{id}, nil
	})
}
