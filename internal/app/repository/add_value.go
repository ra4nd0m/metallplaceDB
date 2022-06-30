package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
	"time"
)

func (r *Repository) AddValue(ctx context.Context, materialName string, sourceName string,
	propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {
	materialSourceId, err := r.GetMaterialSourceId(ctx, materialName, sourceName)
	if err != nil {
		return fmt.Errorf("Can't get source id %w", err)
	}

	propertyId, err := r.GetPropertyId(ctx, propertyName)
	if err != nil {
		return err
	}

	_, err = db.FromContext(ctx).Exec(`
				INSERT INTO material_value (material_source_id, property_id, value_decimal, value_str, created_on)
				VALUES ($1, $2, $3, $4, $5)
				ON CONFLICT DO NOTHING`, materialSourceId, propertyId,
		valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}
