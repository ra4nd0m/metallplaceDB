package handler

import (
	"net/http"
)

// AddUniqueMaterialRequest example
type AddUniqueMaterialRequest struct {
	UId          int    `json:"uid" example:"0" format:"int64"`
	Name         string `json:"name" example:"Сталь суперпрочная" format:"string"`
	Source       string `json:"source" example:"steel.com" format:"string"`
	Group        string `json:"group" example:"Стальная продукция" format:"string"`
	Market       string `json:"market" example:"Восточное поборежье (США)" format:"string"`
	DeliveryType string `json:"delivery_type" example:"CIF" format:"string"`
	Unit         string `json:"unit" example:"$/т" format:"string"`
}

// AddUniqueMaterialResponse example
type AddUniqueMaterialResponse struct {
	Id int `json:"id"`
}

// AddUniqueMaterialHandler godoc
//
//	@Summary		Get material
//	@Description get short info about all unique materials
//	@Tags			material
//	@Accept			json
//	@Produce		json
//	@Param request  body AddUniqueMaterialRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	AddUniqueMaterialResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/addUniqueMaterial [post]
func (h Handler) AddUniqueMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddUniqueMaterialRequest) (AddUniqueMaterialResponse, error) {
		id, err := h.service.AddUniqueMaterial(r.Context(), req.UId, req.Name, req.Group, req.Source, req.Market, req.Unit, req.DeliveryType)
		if err != nil {
			return AddUniqueMaterialResponse{0}, err
		}
		return AddUniqueMaterialResponse{id}, nil
	})
}
