package handler

import (
	"net/http"
)

// InitImportRequest example
type InitImportRequest struct {
	Group string `json:"group" example:"" format:"string"`
}

// InitImportResponse example
type InitImportResponse struct {
	Success bool `json:"success" example:"true" format:"boolean"`
}

// InitImportHandler godoc
//
//	@Summary		Initial import
//	@Description	import materials, properties and values form .xlsx file on server
//	@Tags			value
//	@Accept			json
//	@Produce		json
//	@Param request body InitImportRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	InitImportResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/initImport [post]
func (h Handler) InitImportHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req InitImportRequest) (InitImportResponse, error) {
		if req.Group == "daily" {
			err := h.service.InitialImportDaily(r.Context())
			if err != nil {
				SentrySend(r, err)
				return InitImportResponse{false}, err
			}
			return InitImportResponse{true}, nil
		} else {
			err := h.service.InitialImport(r.Context())
			if err != nil {
				SentrySend(r, err)
				return InitImportResponse{false}, err
			}
			return InitImportResponse{true}, nil
		}

	})
}
