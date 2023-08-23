package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// GetMaterialsRequest example
type GetMaterialsRequest struct{}

// GetMaterialsResponse example
type GetMaterialsResponse struct {
	List []model.MaterialShortInfo `json:"list"`
}

// GetMaterialListHandler godoc
//
//	@Summary		Get material
//	@Description	get short info about all unique materials
//	@Tags			material
//	@Accept			json
//	@Produce		json
//	@Param request  body GetMaterialsRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetMaterialsResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getMaterialList [post]
func (h Handler) GetMaterialListHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(GetMaterialsRequest) (GetMaterialsResponse, error) {
		list, err := h.service.GetMaterialList(r.Context())
		if err != nil {
			SentrySend(r, err)
			return GetMaterialsResponse{}, err
		}
		return GetMaterialsResponse{List: list}, nil
	})
}
