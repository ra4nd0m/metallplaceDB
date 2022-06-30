package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

func (r *Repository) GetMaterialId(ctx context.Context, materialName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).QueryRow(`SELECT id FROM material WHERE name=$1`, materialName)
	if err != nil {
		return 0, fmt.Errorf("Can't get material id %w", err)
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("Can't get id with row.Scan() %w", err)
	}

	return id, nil
}
