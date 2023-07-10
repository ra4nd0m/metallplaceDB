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
			defer h.service.SetLastRequestTime(time.Now().UTC().In(time.UTC).Add(time.Second * 60 * 60 * 3))
			user, err := h.service.GetUserFromJWT(r)
			if err != nil {
				return PriceResponse{}, err
			}
			isModified, err := h.service.CheckChanges(r.Context(), "material_value", h.service.LastRequestTime())
			fmt.Println("SERVICE LAST REQUEST: " + h.service.LastRequestTime().Format("2006-01-02T15:04:05.999999999Z07:00"))
			if err != nil {
				return PriceResponse{}, fmt.Errorf("cant check if table was modified since previous request: %w", err)
			}
			if !isModified && user == "rnd" {
				return PriceResponse{}, nil
			}
		}

		priceFeed, prevPrice, err := h.service.GetMaterialValueForPeriod(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return PriceResponse{priceFeed, prevPrice}, err

	})
}
