package handler

import (
	"metallplace/internal/app/model"
	"net/http"
)

// GetDeliveryTypeListRequest example
type GetDeliveryTypeListRequest struct{}

// GetDeliveryTypeListResponse example
type GetDeliveryTypeListResponse struct {
	List []model.DeliveryTypeInfo `json:"list"`
}

// GetDeliveryTypeListHandler godoc
//
//	@Summary		Get delivery type list
//	@Description	get all existing delivery types
//	@Tags			delivery type
//	@Accept			json
//	@Produce		json
//	@Param request  body GetDeliveryTypeListRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetDeliveryTypeListResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getDeliveryTypeList [post]
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
