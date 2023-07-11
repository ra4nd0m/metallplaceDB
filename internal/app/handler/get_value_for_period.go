package handler

import (
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
	"time"
)

type PriceRequest struct {
	MaterialSourceId int    `json:"material_source_id"`
	PropertyId       int    `json:"property_id"`
	Start            string `json:"start"`
	Finish           string `json:"finish"`
}

type PriceResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
	PrevPrice float64       `json:"prev_price"`
}

func (h Handler) GetValueForPeriodHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req PriceRequest) (PriceResponse, error) {
		if r.Header.Get("Authorization") != "" {
			defer h.service.SetLastRequestTime(time.Now().UTC())
			user, err := h.service.GetUserFromJWT(r)
			if err != nil {
				return PriceResponse{}, err
			}
			isModified, err := h.service.CheckChanges(r.Context(), "material_value", h.service.LastRequestTime())
			if err != nil {
				return PriceResponse{}, fmt.Errorf("cant check if table was modified since previous request: %w", err)
			}
			fmt.Printf("------------ isModified: %v, user: %s", isModified, user)
			if !isModified && user == "rnd" {
				return PriceResponse{}, nil
			}
		}

		priceFeed, prevPrice, err := h.service.GetMaterialValueForPeriod(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return PriceResponse{priceFeed, prevPrice}, err

	})
}
