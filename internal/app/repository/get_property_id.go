package repository

import (
	"context"
	"metallplace/internal/pkg/db"
)

func GetPropertyId(ctx context.Context, propertyName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).Query(`SELECT property FROM source WHERE name=$1`, propertyName)
	if err != nil {
		return 0, err
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
