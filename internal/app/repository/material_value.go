package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
	"time"
)

// AddMaterialValue Adding value to certain property of a product for a certain date
func (r *Repository) AddMaterialValue(ctx context.Context, materialName, sourceName, propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {
	materialSourceId, err := r.GetMaterialSourceId(ctx, materialName, sourceName)
	if err != nil {
		return fmt.Errorf("can't get source id %w", err)
	}

	propertyId, err := r.GetPropertyId(ctx, propertyName)
	if err != nil {
		return err
	}

	_, err = db.FromContext(ctx).Exec(`
				INSERT INTO material_value (material_source_id, property_id, value_decimal, value_str, created_on)
				VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING id`, materialSourceId, propertyId, valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}

func (r *Repository) GetMaterialValueForPeriod(ctx context.Context, materialSourceId int, start string, finish string) ([]model.Price, error) {
	var priceFeed []model.Price
	var price model.Price

	propertyId, err := r.GetPropertyId(ctx, "Средняя цена")
	if err != nil {
		return nil, fmt.Errorf("Can't get property id %w", err)
	}

	rows, err := db.FromContext(ctx).Query(`SELECT created_on, value_decimal 
		FROM material_value WHERE material_source_id=$1 AND property_id=$4 AND created_on >= $2 AND 
			created_on <= $3 ORDER BY created_on ASC`, materialSourceId, start, finish, propertyId)
	if err != nil {
		return nil, fmt.Errorf("Can't get material price %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&price.Date, &price.Value)
		if err != nil {
			return nil, fmt.Errorf("Can't read from rows in get_prices %w", err)
		}
		priceFeed = append(priceFeed, price)
	}

	return priceFeed, nil
}
