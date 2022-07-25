package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v4"
	"metallplace/internal/app/model"
	"metallplace/pkg/gopkg-db"
)

func (r *Repository) AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error) {
	id, err := r.GetPropertyId(ctx, property.Name)
	if err != nil {
		return 0, fmt.Errorf("Cant get property id %w", err)
	}

	if id != 0 {
		return id, nil
	}

	row := db.FromContext(ctx).QueryRow(ctx, `INSERT INTO property (name, kind) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id`,
		property.Name, property.Kind,
	)

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

// GetPropertyId Get property id by property name
func (r *Repository) GetPropertyId(ctx context.Context, propertyName string) (int, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM property WHERE name=$1`, propertyName)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}

	return id, nil
}
