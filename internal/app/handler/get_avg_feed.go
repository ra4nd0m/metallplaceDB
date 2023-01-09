package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type AvgPriceRequest struct {
	MaterialSourceId int    `json:"material_source_id"`
	PropertyId       int    `json:"property_id"`
	Start            string `json:"start"`
	Finish           string `json:"finish"`
}

type AvgPriceResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
	PrevPrice float64       `json:"prev_price"`
}

func (h Handler) GetMonthlyAvgHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AvgPriceRequest) (AvgPriceResponse, error) {
		priceFeed, prevPrice, err := h.service.GetMonthlyAvgFeed(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return AvgPriceResponse{priceFeed, prevPrice}, err
	})
}

func (h Handler) GetWeeklyAvgHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AvgPriceRequest) (AvgPriceResponse, error) {
		priceFeed, prevPrice, err := h.service.GetWeeklyAvgFeed(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return AvgPriceResponse{priceFeed, prevPrice}, err
	})
}
