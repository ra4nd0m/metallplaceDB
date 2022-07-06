package handler

import (
	"net/http"
	"time"
)

type AddValueRequest struct {
	MaterialName string
	SourceName   string
	PropertyName string
	ValueFloat   float64
	ValueStr     string
	CreatedOn    time.Time
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
