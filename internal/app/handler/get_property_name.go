package handler

import (
	"net/http"
)

type GetPropertyNameRequest struct {
	PropertyId int `json:"property_id"`
}

type GetPropertyNameResponse struct {
	PropertyName string `json:"property_name"`
}

func (h Handler) GetPropertyNameHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetPropertyNameRequest) (GetPropertyNameResponse, error) {
		name, err := h.service.GetPropertyName(r.Context(), req.PropertyId)
		if err != nil {
			return GetPropertyNameResponse{}, err
		}
		return GetPropertyNameResponse{PropertyName: name}, nil
	})
}
