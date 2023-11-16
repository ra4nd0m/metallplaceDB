package handler

import (
	"fmt"
	"metallplace/internal/app/model"
	"net/http"
)

// GetSummaryRequest example
type GetSummaryRequest struct {
	MaterialId int    `json:"material_id" example:"2"`
	PropertyId int    `json:"property_id" example:"1"`
	Date       string `json:"date" example:"2023-03-15"`
}

// GetSummaryResponse example
type GetSummaryResponse struct {
	Value model.ChangeSummary `json:"value"`
}

// GetSummaryHandler godoc
//
//	@Summary		Get property changes summary
//	@Description	get daily, weekly and monthly changes of material
//	@Tags			value
//	@Accept			json
//	@Produce		json
//	@Param request  body GetSummaryRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetSummaryResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getChangeSummary [post]
func (h Handler) GetSummaryHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetSummaryRequest) (GetSummaryResponse, error) {
		summary, err := h.service.GetSummary(r.Context(), req.MaterialId, req.PropertyId, req.Date)
		if err != nil {
			SentrySend(r, err)
			return GetSummaryResponse{}, fmt.Errorf("cant get summary of material %d on property %d for %s: %w", req.MaterialId, req.PropertyId, req.Date, err)
		}
		return GetSummaryResponse{Value: summary}, err
	})
}
