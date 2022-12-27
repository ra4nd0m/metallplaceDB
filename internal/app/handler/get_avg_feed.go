package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type AvgPriceRequest struct {
	MaterialSourceId int    `json:"material_source_id" validate:"required"`
	PropertyId       int    `json:"property_id" validate:"required"`
	Start            string `json:"start" validate:"required,datetime=2006-01-02"`
	Finish           string `json:"finish" validate:"required,datetime=2006-01-02"`
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
