package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

type GetDeliveryTypeListRequest struct{}

type GetDeliveryTypeListResponse struct {
	List []model.DeliveryTypeInfo `json:"list"`
}

func (h Handler) GetDeliveryTypeListHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(GetDeliveryTypeListRequest) (GetDeliveryTypeListResponse, error) {
		list, err := h.service.GetDeliveryTypeList(r.Context())
		if err != nil {
			SentrySend(r, err)
			return GetDeliveryTypeListResponse{}, err
		}
		return GetDeliveryTypeListResponse{List: list}, nil
	})
}
