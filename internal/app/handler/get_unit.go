package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type GetUnitListRequest struct{}

type GetUnitListResponse struct {
	List []model.UnitInfo `json:"list"`
}

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
