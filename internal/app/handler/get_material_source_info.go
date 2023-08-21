package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// GetMaterialInfoRequest example
type GetMaterialInfoRequest struct {
	Id int `json:"id" example:"2" format:"int64"`
}

// GetMaterialInfoResponse example
type GetMaterialInfoResponse struct {
	Info model.MaterialShortInfo `json:"info"`
}

// GetMaterialSourceInfoHandler godoc
//
//	@Summary		Get material info
//	@Description	get short info about unique material by id
//	@Tags			material
//	@Accept			json
//	@Produce		json
//	@Param request  body GetMaterialInfoRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetMaterialInfoResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getMaterialInfo [post]
func (h Handler) GetMaterialSourceInfoHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetMaterialInfoRequest) (GetMaterialInfoResponse, error) {

		info, err := h.service.GetMaterialSourceInfo(r.Context(), req.Id)
		if err != nil {
			return GetMaterialInfoResponse{}, err
		}
		return GetMaterialInfoResponse{Info: info}, nil
	})
}
