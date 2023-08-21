package handler

import "net/http"

// AddPropertyToMaterialRequest example
type AddPropertyToMaterialRequest struct {
	MaterialId   int    `json:"material_id" example:"1" format:"int64"`
	PropertyName string `json:"property_name" example:"Средняя цена" format:"string"`
	Kind         string `json:"kind" example:"decimal" format:"string"`
}

// AddPropertyToMaterialResponse example
type AddPropertyToMaterialResponse struct {
	Success bool `json:"success" example:"true" format:"boolean"`
}

// AddPropertyToMaterialHandler godoc
//
//	@Summary		Add property to material
//	@Description	add property to material by id
//	@Tags			property
//	@Accept			json
//	@Produce		json
//	@Param request  body AddPropertyToMaterialRequest true "query params"
//	@Param Authorization header string true "Authorization"
//	@SecurityDefinitions.apikey ApiKeyAuth
//	@Success		200	{object}	AddPropertyToMaterialResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/addPropertyToMaterial [post]
func (h Handler) AddPropertyToMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddPropertyToMaterialRequest) (AddPropertyToMaterialResponse, error) {
		err := h.service.AddPropertyToMaterial(r.Context(), req.MaterialId, req.PropertyName, req.Kind)
		if err != nil {
			return AddPropertyToMaterialResponse{false}, err
		}
		return AddPropertyToMaterialResponse{true}, nil
	})
}
