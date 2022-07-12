package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type GetMaterialsResponse struct {
	List []model.MaterialShortInfo `json:"list"`
}

func (h Handler) GetMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(_ any) (GetMaterialsResponse, error) {
		list, err := h.service.GetMaterialList(r.Context())
		return GetMaterialsResponse{list}, err
	})
}
