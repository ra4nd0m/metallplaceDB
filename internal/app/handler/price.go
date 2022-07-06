package handler

import (
	"metallplace/internal/app/model"
	"metallplace/internal/app/repository"
	"net/http"
)

type PriceRequest struct {
	MaterialSourceId int    `json:"material_source_id"`
	Start            string `json:"start"`
	Finish           string `json:"finish"`
}

type PriceResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
}

func (h Handler) PriceHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req PriceRequest) (PriceResponse, error) {
		priceFeed, err := repository.New().GetPricesForPeriod(r.Context(), req.MaterialSourceId, req.Start, req.Finish)
		return PriceResponse{priceFeed}, err
	})
}
