package repository

import (
	"context"
	"metallplace/internal/pkg/db"
)

func GetSourceId(ctx context.Context, sourceName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).Query(`SELECT id FROM source WHERE name=$1`, sourceName)
	if err != nil {
		return 0, err
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
