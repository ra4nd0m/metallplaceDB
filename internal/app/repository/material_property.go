package repository

import (
	"context"
	"fmt"
	"metallplace/pkg/gopkg-db"
)

// AddMaterialProperty Tie material and property by id
func (r *Repository) AddMaterialProperty(ctx context.Context, materialId int, propertyId int) error {
	_, err := db.FromContext(ctx).Exec(ctx, `INSERT INTO material_property (material_id, property_id) VALUES ($1, $2) ON CONFLICT (material_id, property_id) DO NOTHING`,
		materialId, propertyId)
	if err != nil {
		return fmt.Errorf("Can't tie material and it's properties %w", err)
	}
	return nil
}
