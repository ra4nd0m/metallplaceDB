package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

func (r *Repository) GetSourceId(ctx context.Context, sourceName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).QueryRow(`SELECT id FROM source WHERE name=$1`, sourceName)
	if err != nil {
		return 0, fmt.Errorf("Can't get source id %w", err)
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("Can't get source id with row.Scan() %w", err)
	}

	return id, nil
}
