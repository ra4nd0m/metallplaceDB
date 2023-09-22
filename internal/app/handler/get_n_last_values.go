package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// LastValuesRequest example
type LastValuesRequest struct {
	MaterialSourceId int    `json:"material_source_id" example:"3" format:"int64"`
	PropertyId       int    `json:"property_id" example:"1" format:"int64"`
	NValues          int    `json:"n_values" example:"10" format:"int64"`
	Finish           string `json:"finish" example:"2022-03-17" format:"string"`
}

// LastValuesResponse example
type LastValuesResponse struct {
	PriceFeed []model.Price `json:"price_feed"`
}

// GetNLastValues godoc
//
//	@Summary		Get n last values
//	@Description	get n last values of specific property of specific material
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
//	@Router			/getNLastValues [post]
func (h Handler) GetNLastValues(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req LastValuesRequest) (LastValuesResponse, error) {
		priceFeed, err := h.service.GetNLastValues(r.Context(), req.MaterialSourceId, req.PropertyId, req.NValues, req.Finish)
		if err != nil {
			SentrySend(r, err)
			return LastValuesResponse{}, err
		}
		return LastValuesResponse{priceFeed}, nil
	})
}
