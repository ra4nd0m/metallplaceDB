package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// GetUnitListRequest example
type GetUnitListRequest struct{}

// GetUnitListResponse example
type GetUnitListResponse struct {
	List []model.UnitInfo `json:"list"`
}

// GetUnitListHandler godoc
//
//	@Summary		Get unit list
//	@Description	get all existing unit types
//	@Tags			unit
//	@Accept			json
//	@Produce		json
//	@Param request  body GetUnitListRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetUnitListResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getUnitList [post]
func (h Handler) GetUnitListHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(GetUnitListRequest) (GetUnitListResponse, error) {
		list, err := h.service.GetUnitList(r.Context())
		if err != nil {
			SentrySend(r, err)
			return GetUnitListResponse{}, err
		}
		return GetUnitListResponse{List: list}, nil
	})
}
