package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

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
