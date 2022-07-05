package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

// GetSourceId Get id by name
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

// GetSourceName Get name by id
func (r *Repository) GetSourceName(ctx context.Context, sourceId int) (string, error) {
	var name string
	row, err := db.FromContext(ctx).QueryRow(`SELECT name FROM source WHERE id=$1`, sourceId)
	if err != nil {
		return "", fmt.Errorf("Can't get source name %w", err)
	}

	err = row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("Can't get source name with row.Scan() %w", err)
	}

	return name, nil
}
