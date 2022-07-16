package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type LastValuesRequest struct {
	MaterialSourceId int `json:"material_source_id"`
	NValues          int `json:"n_values"`
}

type LastValuesResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
}

func (h Handler) GetNLastValues(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req LastValuesRequest) (LastValuesResponse, error) {
		priceFeed, err := h.service.GetNLastValues(r.Context(), req.MaterialSourceId, req.NValues)
		return LastValuesResponse{priceFeed}, err
	})
}
