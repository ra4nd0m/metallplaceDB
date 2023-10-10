package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// GetMaterialListRequest example
type GetMaterialListRequest struct{}

// GetMaterialListResponse example
type GetMaterialListResponse struct {
	List []model.MaterialShortInfo `json:"list"`
}

// GetMaterialListHandler godoc
//
//	@Summary		Get materials list
//	@Description	get short info about all unique materials
//	@Tags			material
//	@Accept			json
//	@Produce		json
//	@Param request  body GetMaterialListRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetMaterialListResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getMaterialList [post]
func (h Handler) GetMaterialListHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(GetMaterialListRequest) (GetMaterialListResponse, error) {
		list, err := h.service.GetMaterialList(r.Context())
		if err != nil {
			SentrySend(r, err)
			return GetMaterialListResponse{}, err
		}
		return GetMaterialListResponse{List: list}, nil
	})
}
