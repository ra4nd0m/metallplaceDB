package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func (r *Repository) AddProperties(ctx context.Context, material model.Material, properties []model.Property) error {
	for _, property := range properties {

		// adding properties
		_, err := db.FromContext(ctx).Exec(`INSERT INTO property (name, kind) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
			property.Name, property.Kind,
		)
		if err != nil {
			return fmt.Errorf("Can't add property %w", err)
		}

		materialId, err := r.GetMaterialId(ctx, material.Name)
		if err != nil {
			return fmt.Errorf("Can't get material id %w", err)
		}

		sourceId, err := r.GetPropertyId(ctx, property.Name)
		if err != nil {
			return fmt.Errorf("Can't get source id %w", err)
		}

		// tying material and it's properties
		_, err = db.FromContext(ctx).Exec(`INSERT INTO material_property (material_id, property_id) VALUES ($1, $2) ON CONFLICT (material_id, property_id) DO NOTHING`,
			materialId, sourceId)
		if err != nil {
			return fmt.Errorf("Can't tie material and it's properties %w", err)
		}
	}
	return nil
}
