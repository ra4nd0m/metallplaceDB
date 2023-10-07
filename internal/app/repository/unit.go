package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	db "metallplace/pkg/gopkg-db"
)

// AddUnitIfNotExists Add new unit type
func (r *Repository) AddUnitIfNotExists(ctx context.Context, unit string) error {
	id, err := r.GetUnitId(ctx, unit)
	if err != nil {
		return err
	}
	if id != 0 {
		return nil
	}

	_, err = db.FromContext(ctx).Exec(
		ctx, `INSERT INTO unit (name) VALUES ($1)`, unit)
	if err != nil {
		return fmt.Errorf("Can't add unit %w", err)
	}
	return nil
}

// GetUnitId Get unit id by name
func (r *Repository) GetUnitId(ctx context.Context, unitName string) (int, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM unit WHERE name=$1`, unitName)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("Can't get unit id with row.Scan() %w", err)
	}

	return id, nil
}

// GetUnitName Get the unit name by id
func (r *Repository) GetUnitName(ctx context.Context, unitId string) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM unit WHERE id=$1`, unitId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("Can't get unit name with row.Scan() %w", err)
	}

	return name, nil
}
