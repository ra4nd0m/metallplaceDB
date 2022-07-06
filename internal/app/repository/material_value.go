package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
	"time"
)

func (r *Repository) AddMaterialValue(ctx context.Context, materialSourceId, propertyId int, valueFloat float64, valueStr string, createdOn time.Time) error {
	_, err := db.FromContext(ctx).Exec(`
				INSERT INTO material_value (material_source_id, property_id, value_decimal, value_str, created_on)
				VALUES ($1, $2, $3, $4, $5)
				ON CONFLICT DO NOTHING`, materialSourceId, propertyId, valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}

func (r *Repository) GetMaterialValueForPeriod(ctx context.Context, materialSourceId int, start string, finish string) ([]model.Price, error) {
	var priceFeed []model.Price
	var price model.Price

	rows, err := db.FromContext(ctx).Query(`SELECT created_on, value_decimal 
		FROM material_value WHERE material_source_id=$1 AND created_on >= $2 AND 
			created_on <= $3`, materialSourceId, start, finish)
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
