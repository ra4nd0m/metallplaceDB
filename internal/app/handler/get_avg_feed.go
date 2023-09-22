package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// AvgPriceRequest example
type AvgPriceRequest struct {
	MaterialSourceId int    `json:"material_source_id" example:"2" format:"int64"`
	PropertyId       int    `json:"property_id" example:"1" format:"int64"`
	Start            string `json:"start" example:"2019-01-01" format:"string"`
	Finish           string `json:"finish" example:"2020-01-01" format:"string"`
}

// AvgPriceResponse example
type AvgPriceResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
	PrevPrice float64       `json:"prev_price" example:"42.55" format:"float64"`
}

// GetMonthlyAvgHandler godoc
//
//	@Summary		Get monthly averaged feed
//	@Description	returns price feed averaged by month. We get month + avg price during it
//	@Tags			value
//	@Accept			json
//	@Produce		json
//	@Param request  body AvgPriceRequest true "query params"
//	@Success		200	{object}	AvgPriceResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getMonthlyAvgFeed [post]
func (h Handler) GetMonthlyAvgHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AvgPriceRequest) (AvgPriceResponse, error) {
		priceFeed, prevPrice, err := h.service.GetMonthlyAvgFeed(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		return AvgPriceResponse{priceFeed, prevPrice}, err
	})
}

// GetWeeklyAvgHandler godoc
//
//	@Summary		Get weekly feed
//	@Description	returns weekly feed of average values during the week
//	@Tags			value
//	@Accept			json
//	@Produce		json
//	@Param request body AvgPriceRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	AvgPriceResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getWeeklyAvgFeed [post]
func (h Handler) GetWeeklyAvgHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AvgPriceRequest) (AvgPriceResponse, error) {
		priceFeed, prevPrice, err := h.service.GetWeeklyAvgFeed(r.Context(), req.MaterialSourceId, req.PropertyId, req.Start, req.Finish)
		if err != nil {
			SentrySend(r, err)
			return AvgPriceResponse{}, err
		}
		return AvgPriceResponse{priceFeed, prevPrice}, nil
	})
}
