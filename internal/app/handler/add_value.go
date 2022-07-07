package handler

import (
	"net/http"
	"strconv"
	"time"
)

type AddValueRequest struct {
	MaterialName string    `json:"material_name"`
	SourceName   string    `json:"source_name"`
	PropertyName string    `json:"property_name"`
	ValueFloat   string    `json:"value_float"`
	ValueStr     string    `json:"value_str"`
	CreatedOn    time.Time `json:"created_on"`
}

type AddValueResponse struct {
	Success bool
}

func (h Handler) AddValueHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddValueRequest) (AddValueResponse, error) {
		valueFloat, err := strconv.ParseFloat(req.ValueFloat, 64)
		if err != nil {
			return AddValueResponse{false}, err
		}
		err = h.service.AddValue(r.Context(), req.MaterialName, req.SourceName,
			req.PropertyName, valueFloat, req.ValueStr, req.CreatedOn)
		if err != nil {
			return AddValueResponse{false}, err
		}
		return AddValueResponse{true}, err
	})
}
