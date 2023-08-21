package handler

import (
	"metallplace/internal/app/model"
	"net/http"
	"strconv"
)

// GetPropertyListRequest example
type GetPropertyListRequest struct {
	MaterialSourceId string `json:"material_source_id" example:"12" format:"int64"`
}

// GetPropertyListResponse example
type GetPropertyListResponse struct {
	List []model.PropertyShortInfo `json:"list"`
}

// GetPropertyListHandler godoc
//
//	@Summary		Get all properties
//	@Description	get list of existing properties
//	@Tags			property
//	@Accept			json
//	@Produce		json
//	@Param request body GetPropertyListRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetPropertyListResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getPropertyList [post]
func (h Handler) GetPropertyListHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetPropertyListRequest) (GetPropertyListResponse, error) {
		id, err := strconv.Atoi(req.MaterialSourceId)
		if err != nil {
			return GetPropertyListResponse{}, err
		}
		list, err := h.service.GetPropertyList(r.Context(), id)
		return GetPropertyListResponse{List: list}, err
	})
}
