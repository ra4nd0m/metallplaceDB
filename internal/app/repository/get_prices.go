package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func (r *Repository) GetPricesForPeriod(ctx context.Context, materialSourceId int, start string, finish string) ([]model.Price, error) {
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
