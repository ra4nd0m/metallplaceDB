package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

// GetMaterialId Get material id by material name
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

// GetMaterialName Get material name by material id
func (r *Repository) GetMaterialName(ctx context.Context, materialId int) (string, error) {
	var name string
	row, err := db.FromContext(ctx).QueryRow(`SELECT name FROM material WHERE id=$1`, materialId)
	if err != nil {
		return "", fmt.Errorf("Can't get material name %w", err)
	}

	err = row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("Can't get material name with row.Scan() %w", err)
	}

	return name, nil
}
