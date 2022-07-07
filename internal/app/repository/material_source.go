package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

// AddMaterialSource Adding material - source - market - unit combo
func (r *Repository) AddMaterialSource(ctx context.Context, materialName, sourceName, market, unit string) error {
	materialId, err := r.GetMaterialId(ctx, materialName)
	if err != nil {
		return fmt.Errorf("Can't get material id %w", err)
	}

	sourceId, err := r.GetSourceId(ctx, sourceName)
	if err != nil {
		return fmt.Errorf("Can't get source id %w", err)
	}

	_, err = db.FromContext(ctx).Query(
		`INSERT INTO material_source (material_id, source_id, target_market, unit) 
		VALUES ($1, $2, $3, $4) 
		ON CONFLICT DO NOTHING RETURNING id`,
		materialId, sourceId, market, unit)

	if err != nil {
		return fmt.Errorf("Can't tie material, source, unit and market %w", err)
	}

	return nil
}

// GetMaterialSourceId Get unique material-source combo by material and source name
func (r *Repository) GetMaterialSourceId(ctx context.Context, materialName string, sourceName string) (int, error) {
	var id int
	materialId, err := r.GetMaterialId(ctx, materialName)
	if err != nil {
		return 0, fmt.Errorf("Can't get material id %w", err)
	}

	sourceId, err := r.GetSourceId(ctx, sourceName)
	if err != nil {
		return 0, fmt.Errorf("Can't get source id %w", err)
	}

	row, err := db.FromContext(ctx).QueryRow(`SELECT id FROM material_source WHERE material_id=$1 AND
		source_id=$2`, materialId, sourceId)
	if err != nil {
		return 0, fmt.Errorf("Can't get material-source pair id %w", err)
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
