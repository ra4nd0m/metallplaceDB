package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func (r *Repository) GetNLastValues(ctx context.Context, materialSourceId int, nValues int) ([]model.Price, error) {
	var priceFeed []model.Price
	var price model.Price

	propertyId, err := r.GetPropertyId(ctx, "Средняя цена")
	if err != nil {
		return nil, fmt.Errorf("cfnt get propertyId: %v", err)
	}

	rows, err := db.FromContext(ctx).Query(
		"SELECT * FROM "+
			"("+
			"SELECT created_on, value_decimal "+
			"FROM material_value "+
			"WHERE material_source_id=$1 AND property_id=$2 "+
			"ORDER BY created_on "+
			"DESC LIMIT $3 "+
			") AS last_n_values "+
			"ORDER BY created_on ASC", materialSourceId, propertyId, nValues)

	if err != nil {
		return nil, fmt.Errorf("Can't get n last material prices %w", err)
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
