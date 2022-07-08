package repository

import (
	"context"
	"database/sql"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func (r *Repository) AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error) {
	id, err := r.GetPropertyId(ctx, property.Name)
	if err != nil {
		return 0, fmt.Errorf("Cant get property id %w", err)
	}

	if id != 0 {
		return id, nil
	}

	row, err := db.FromContext(ctx).QueryRow(`INSERT INTO property (name, kind) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id`,
		property.Name, property.Kind,
	)
	if err != nil {
		return 0, fmt.Errorf("Can't add property %w", err)
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

// GetPropertyId Get property id by property name
func (r *Repository) GetPropertyId(ctx context.Context, propertyName string) (int, error) {
	var id int
	row, err := db.FromContext(ctx).QueryRow(`SELECT id FROM property WHERE name=$1`, propertyName)
	if err != nil {
		return 0, fmt.Errorf("Can't get property id %w", err)
	}

	if row == nil {
		return 0, nil
	}

	err = row.Scan(&id)
	if err == sql.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}

	return id, nil
}
