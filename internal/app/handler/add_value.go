package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
)

type AddValueRequest struct {
	MaterialSourceId int    `json:"material_source_id"`
	PropertyName     string `json:"property_name"`
	ValueFloat       string `json:"value_float"`
	ValueStr         string `json:"value_str"`
	CreatedOn        string `json:"created_on"`
}

type AddValueResponse struct {
	Success bool
}

func (h Handler) AddValueHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddValueRequest) (AddValueResponse, error) {
		var valueFloat float64

		createdOn, err := time.Parse("2006-01-02", req.CreatedOn)
		if err != nil {
			if err != nil {
				return AddValueResponse{false}, fmt.Errorf("cant parse date: %w", err)
			}
		}

		if req.ValueFloat != "" {
			valueFloat, err = strconv.ParseFloat(req.ValueFloat, 64)
		}

		if err != nil {
			return AddValueResponse{false}, fmt.Errorf("cant parse float: %w", err)
		}

		err = h.service.AddValue(r.Context(), req.MaterialSourceId,
			req.PropertyName, valueFloat, req.ValueStr, createdOn)
		if err != nil {
			return AddValueResponse{false}, fmt.Errorf("cant add value: %w", err)
		}
		return AddValueResponse{true}, err
	})
}
