package repository

import (
	"context"
	"metallplace/internal/pkg/db"
)

func GetMaterialId(ctx context.Context, materialName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).Query(`SELECT id FROM material WHERE name=$1`, materialName)
	if err != nil {
		return 0, err
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
