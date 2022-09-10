package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/pkg/gopkg-db"
	"time"
)

// AddMaterialValue Adding value to certain property of a product for a certain date
func (r *Repository) AddMaterialValue(ctx context.Context, materialSourceId int, propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {
	propertyId, err := r.GetPropertyId(ctx, propertyName)
	if err != nil {
		return err
	}

	_, err = db.FromContext(ctx).Exec(ctx, `
				INSERT INTO material_value (material_source_id, property_id, value_decimal, value_str, created_on)
				VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING id`, materialSourceId, propertyId, valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}

func (r *Repository) GetMaterialValueForPeriod(ctx context.Context, materialSourceId, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	var priceFeed []model.Price
	var price model.Price
	var prevPrice float64

	rows, err := db.FromContext(ctx).Query(ctx, `SELECT created_on, value_decimal 
		FROM material_value WHERE material_source_id=$1 AND property_id=$4 AND created_on >= $2 AND 
			created_on <= $3 ORDER BY created_on ASC`, materialSourceId, start, finish, propertyId)
	if err != nil {
		return nil, 0, fmt.Errorf("Can't get material price %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&price.Date, &price.Value)
		if err != nil {
			return nil, 0, fmt.Errorf("Can't read from rows in get_prices %w", err)
		}
		priceFeed = append(priceFeed, price)
	}

	row := db.FromContext(ctx).QueryRow(ctx, `SELECT value_decimal 
		FROM material_value WHERE material_source_id=$1 AND property_id=$3 AND created_on < $2 ORDER BY created_on DESC LIMIT 1`, materialSourceId, start, propertyId)
	err = row.Scan(&prevPrice)
	if err != nil {
		return nil, 0, fmt.Errorf("Can't get prev price %w", err)
	}

	return priceFeed, prevPrice, nil
}
