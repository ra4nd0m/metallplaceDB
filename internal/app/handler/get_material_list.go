package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type GetMaterialsRequest struct{}

type GetMaterialsResponse struct {
	List []model.MaterialShortInfo `json:"list"`
}

func (h Handler) GetMaterialListHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(GetMaterialsRequest) (GetMaterialsResponse, error) {
		list, err := h.service.GetMaterialList(r.Context())
		return GetMaterialsResponse{list}, err
	})
}
