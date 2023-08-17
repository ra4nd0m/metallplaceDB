package repository

import (
	"context"
	"fmt"
	"metallplace/pkg/gopkg-db"
)

// AddMaterialProperty Tie material and property by id
func (r *Repository) AddMaterialProperty(ctx context.Context, uid int, propertyId int) error {
	_, err := db.FromContext(ctx).Exec(ctx, `INSERT INTO material_property (uid, property_id) VALUES ($1, $2) ON CONFLICT (uid, property_id) DO NOTHING`,
		uid, propertyId)
	if err != nil {
		return fmt.Errorf("can't tie material and it's properties %w", err)
	}
	return nil
}
