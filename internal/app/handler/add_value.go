package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
)

// AddValueRequest example
type AddValueRequest struct {
	MaterialSourceId int    `json:"material_source_id" example:"2" format:"int64"`
	PropertyName     string `json:"property_name" example:"Средняя цена" format:"string"`
	ValueFloat       string `json:"value_float" example:"123.98" format:"string"`
	ValueStr         string `json:"value_str" example:"" format:"string"`
	CreatedOn        string `json:"created_on" example:"2029-09-14" format:"string"`
}

// AddValueResponse example
type AddValueResponse struct {
	Success bool `json:"success" example:"true" format:"bool"`
}

// AddValueHandler godoc
//
//	@Summary		Get last values
//	@Description	get n last values of specific property of specific material
//	@Tags			value
//	@Accept			json
//	@Produce		json
//	@Param request body AddValueRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	AddValueResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/addValue [post]
func (h Handler) AddValueHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddValueRequest) (AddValueResponse, error) {
		var valueFloat float64

		createdOn, err := time.Parse("2006-01-02", req.CreatedOn)
		if err != nil {
			if err != nil {
				SentrySend(r, err)
				return AddValueResponse{false}, fmt.Errorf("cant parse date: %w", err)
			}
		}

		if req.ValueFloat != "" {
			valueFloat, err = strconv.ParseFloat(req.ValueFloat, 64)
		}

		if err != nil {
			SentrySend(r, err)
			return AddValueResponse{false}, fmt.Errorf("cant parse float: %w", err)
		}

		err = h.service.AddValue(r.Context(), req.MaterialSourceId,
			req.PropertyName, valueFloat, req.ValueStr, createdOn)
		if err != nil {
			SentrySend(r, err)
			return AddValueResponse{false}, fmt.Errorf("cant add value: %w", err)
		}
		return AddValueResponse{true}, nil
	})
}
