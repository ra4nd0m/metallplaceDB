package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"metallplace/internal/app/model"
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
		return fmt.Errorf("can't add unit %w", err)
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
		return 0, fmt.Errorf("can't get unit id with row.Scan() %w", err)
	}

	return id, nil
}

// GetUnitName Get the unit name by id
func (r *Repository) GetUnitName(ctx context.Context, unitId int) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM unit WHERE id=$1`, unitId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("can't get unit name with row.Scan() %w", err)
	}

	return name, nil
}

// GetUnitList Get all existing units
func (r *Repository) GetUnitList(ctx context.Context) ([]model.UnitInfo, error) {
	var list []model.UnitInfo

	rows, err := db.FromContext(ctx).Query(ctx, `SELECT id, name FROM unit`)
	if err != nil {
		return nil, fmt.Errorf("can't get unit list rows %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name string
		err = rows.Scan(&id, &name)
		if err != nil {
			return nil, fmt.Errorf("cant scan rows while getting unit list: %w", err)
		}
		list = append(list, model.UnitInfo{Id: id, Name: name})
	}
	return list, nil
}
