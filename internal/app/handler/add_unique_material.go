package handler

import (
	"net/http"
)

type AddUniqueMaterialRequest struct {
	MaterialName   string
	MaterialSource string
	MaterialMarket string
	MaterialUnit   string
}

type AddUniqueMaterialResponse struct {
	Success bool
}

func (h Handler) AddUniqueMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddUniqueMaterialRequest) (AddUniqueMaterialResponse, error) {
		_, err := h.service.AddUniqueMaterial(r.Context(), req.MaterialName, req.MaterialSource, req.MaterialMarket, req.MaterialUnit)
		if err != nil {
			return AddUniqueMaterialResponse{false}, err
		}
		return AddUniqueMaterialResponse{true}, err
	})
}
