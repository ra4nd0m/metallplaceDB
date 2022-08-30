package handler

import (
	"metallplace/internal/app/model"
	"net/http"
	"strconv"
)

type GetPropertyListRequest struct {
	MaterialSourceId string `json:"material_source_id"`
}

type GetPropertyListResponse struct {
	List []model.PropertyShortInfo `json:"list"`
}

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
