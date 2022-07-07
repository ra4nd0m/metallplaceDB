package handler

import (
	"net/http"
	"time"
)

type AddValueRequest struct {
	MaterialName string    `json:"material_name"`
	SourceName   string    `json:"source_name"`
	PropertyName string    `json:"property_name"`
	ValueFloat   float64   `json:"value_float"`
	ValueStr     string    `json:"value_str"`
	CreatedOn    time.Time `json:"created_on"`
}

type AddValueResponse struct {
	Success bool
}

func (h Handler) AddValueHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddValueRequest) (AddValueResponse, error) {
		err := h.service.AddValue(r.Context(), req.MaterialName, req.SourceName,
			req.PropertyName, req.ValueFloat, req.ValueStr, req.CreatedOn)
		if err != nil {
			return AddValueResponse{false}, err
		}
		return AddValueResponse{true}, err
	})
}
