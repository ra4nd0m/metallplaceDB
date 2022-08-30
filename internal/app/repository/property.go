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

// TBA
func (r *Repository) GetPropertyName(ctx context.Context, id int) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM property WHERE id=$1`, id)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("cant get property name with row.Scan() %w", err)
	}

	return name, nil
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
		return 0, fmt.Errorf("cant scan property id from row", err)
	}

	return id, nil
}

//GetPropertyList Returns property list for unique material
func (r *Repository) GetPropertyList(ctx context.Context, materialSourceId int) ([]model.PropertyShortInfo, error) {
	var propertyList []model.PropertyShortInfo
	var propertyId int
	rows, err := db.FromContext(ctx).Query(ctx, `SELECT property_id FROM material_property WHERE material_source_id=$1`, materialSourceId)
	if err != nil {
		return nil, fmt.Errorf("Can't get property_id rows %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		rows.Scan(&propertyId)
		propertyName, err := r.GetPropertyName(ctx, propertyId)
		if err != nil {
			return nil, fmt.Errorf("cant get property name: %w", err)
		}
		propertyKind, err := r.GetPropertyKind(ctx, propertyId)
		if err != nil {
			return nil, fmt.Errorf("cant get type in GetPropertyList: %w", err)
		}
		propertyList = append(propertyList, model.PropertyShortInfo{Id: propertyId, Name: propertyName, Kind: propertyKind})
	}

	return propertyList, nil
}

// GetPropertyKind Gets kind by property id
func (r *Repository) GetPropertyKind(ctx context.Context, propertyId int) (string, error) {
	var propertyType string

	row := db.FromContext(ctx).QueryRow(ctx, `SELECT kind FROM property WHERE id=$1`, propertyId)
	err := row.Scan(&propertyType)
	if err != nil {
		return "", fmt.Errorf("cant get property type: %w", err)
	}

	return propertyType, nil
}
