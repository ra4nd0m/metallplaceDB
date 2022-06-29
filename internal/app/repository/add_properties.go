package repository

import (
	"context"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func AddProperties(ctx context.Context, material model.Material, properties []model.Property) error {
	for _, property := range properties {

		// adding properties
		_, err := db.FromContext(ctx).Exec(`INSERT INTO property VALUES ($1, $2) ON CONFLICT DO NOTHING/UPDATE;`,
			property.Name, property.Kind,
		)
		if err != nil {
			return err
		}

		materialId, err := GetMaterialId(ctx, material.Name)
		if err != nil {
			return err
		}

		sourceId, err := GetSourceId(ctx, material.Source)
		if err != nil {
			return err
		}

		// tying material and it's properties
		_, err = db.FromContext(ctx).Exec(`INSERT INTO material_property (material_id, source_id) VALUES ($1, $2)`,
			materialId, sourceId)
		if err != nil {
			return err
		}
	}
	return nil
}
