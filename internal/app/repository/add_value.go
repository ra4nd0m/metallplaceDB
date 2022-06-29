package repository

import (
	"context"
	"metallplace/internal/pkg/db"
	"time"
)

func AddValue(ctx context.Context, materialName string, sourceName string,
	propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {
	materialSourceId, err := GetMaterialSourceId(ctx, materialName, sourceName)
	if err != nil {
		return nil
	}

	propertyId, err := GetPropertyId(ctx, propertyName)
	if err != nil {
		return nil
	}

	_, err = db.FromContext(ctx).Exec(`
				INSERT INTO material_value (material_source_id, property_id, value_decimal, value_str, created_on)
				VALUES ($1, $2, $3, $4, $5)
				ON CONFLICT DO NOTHING/UPDATE;`, materialSourceId, propertyId,
		valueFloat, valueStr, createdOn)
	if err != nil {
		return nil
	}

	return nil
}
