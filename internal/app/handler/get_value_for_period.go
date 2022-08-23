package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type PriceRequest struct {
	MaterialSourceId int    `json:"material_source_id"`
	PropertyId       int    `json:"property_id"`
	Start            string `json:"start"`
	Finish           string `json:"finish"`
}

type PriceResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
}

func (h Handler) GetValueForPeriodHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req PriceRequest) (PriceResponse, error) {
		priceFeed, err := h.service.GetMaterialValueForPeriod(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return PriceResponse{priceFeed}, err
	})
}
