package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

func (r *Repository) GetPropertyId(ctx context.Context, propertyName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).QueryRow(`SELECT id FROM property WHERE name=$1`, propertyName)
	if err != nil {
		return 0, fmt.Errorf("Can't get property id %w", err)
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
