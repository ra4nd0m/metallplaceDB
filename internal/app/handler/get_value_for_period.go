package handler

import (
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
	"time"
)

// PriceRequest example
type PriceRequest struct {
	MaterialSourceId int    `json:"material_source_id" example:"2" type:"int64"`
	PropertyId       int    `json:"property_id" example:"1" type:"int64"`
	Start            string `json:"start" example:"2019-01-01" type:"string"`
	Finish           string `json:"finish" example:"2020-01-01" type:"string"`
}

// PriceResponse example
type PriceResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
	PrevPrice float64       `json:"prev_price" example:"11.5" type:"float64"`
}

// GetValueForPeriodHandler godoc
//
//	@Summary		Get values
//	@Description	get values of specified period for specified material and property
//	@Tags			value
//	@Accept			json
//	@Produce		json
//	@Param request body LastValuesRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	LastValuesResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getValueForPeriod [post]
func (h Handler) GetValueForPeriodHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req PriceRequest) (PriceResponse, error) {
		if r.Header.Get("Authorization") != "" {
			defer h.service.SetLastRequestTime(time.Now().UTC())
			user, err := h.service.GetUserFromJWT(r)
			if err != nil {
				SentrySend(r, err)
				return PriceResponse{}, err
			}
			isModified, err := h.service.CheckChanges(r.Context(), "material_value", h.service.LastRequestTime())
			if err != nil {
				SentrySend(r, err)
				return PriceResponse{}, fmt.Errorf("cant check if table was modified since previous request: %w", err)
			}
			if !isModified && user == "rnd" {
				SentrySend(r, err)
				return PriceResponse{}, nil
			}
		}

		priceFeed, prevPrice, err := h.service.GetMaterialValueForPeriod(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return PriceResponse{priceFeed, prevPrice}, err

	})
}
