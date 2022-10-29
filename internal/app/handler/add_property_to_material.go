package handler

import "net/http"

type AddPropertyToMaterialRequest struct {
	MaterialId   int    `json:"material_id"`
	PropertyName string `json:"property_name"`
	Kind         string `json:"kind"`
}

type AddPropertyToMaterialResponse struct {
	Success bool `json:"success"`
}

func (h Handler) AddPropertyToMaterialHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req AddPropertyToMaterialRequest) (AddPropertyToMaterialResponse, error) {
		err := h.service.AddPropertyToMaterial(r.Context(), req.MaterialId, req.PropertyName, req.Kind)
		if err != nil {
			return AddPropertyToMaterialResponse{false}, err
		}
		return AddPropertyToMaterialResponse{true}, nil
	})
}
