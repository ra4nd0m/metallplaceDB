package handler

import (
	"net/http"
)

// GetPropertyNameRequest example
type GetPropertyNameRequest struct {
	PropertyId int `json:"property_id" example:"2" format:"int64"`
}

// GetPropertyNameResponse example
type GetPropertyNameResponse struct {
	PropertyName string `json:"property_name" example:"Средняя ценв"`
}

// GetPropertyNameHandler godoc
//
//	@Summary		Get property name
//	@Description	get property name by id
//	@Tags			property
//	@Accept			json
//	@Produce		json
//	@Param request  body GetPropertyNameRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	GetPropertyNameResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/getPropertyName [post]
func (h Handler) GetPropertyNameHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetPropertyNameRequest) (GetPropertyNameResponse, error) {
		name, err := h.service.GetPropertyName(r.Context(), req.PropertyId)
		if err != nil {
			return GetPropertyNameResponse{}, err
		}
		return GetPropertyNameResponse{PropertyName: name}, nil
	})
}
