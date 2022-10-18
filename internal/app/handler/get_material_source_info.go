package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type GetMaterialInfoRequest struct {
	Id int `json:"id"`
}

type GetMaterialInfoResponse struct {
	Info model.MaterialShortInfo `json:"info"`
}

func (h Handler) GetMaterialSourceInfoHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetMaterialInfoRequest) (GetMaterialInfoResponse, error) {

		info, err := h.service.GetMaterialSourceInfo(r.Context(), req.Id)
		if err != nil {
			return GetMaterialInfoResponse{}, err
		}
		return GetMaterialInfoResponse{Info: info}, nil
	})
}
