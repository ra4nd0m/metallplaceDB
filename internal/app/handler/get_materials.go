package handler

import (
	"metallplace/internal/app/model"
	"metallplace/internal/app/repository"
	"net/http"
)

type GetMaterialsRequest struct{}

type GetMaterialsResponse struct {
	List []model.MaterialShortInfo `json:"list"`
}

func GetMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetMaterialsRequest) (GetMaterialsResponse, error) {
		list, err := repository.New().GetMaterialList(r.Context())
		return GetMaterialsResponse{list}, err
	})
}
