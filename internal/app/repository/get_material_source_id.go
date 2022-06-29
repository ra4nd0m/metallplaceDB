package repository

import (
	"context"
	"metallplace/internal/pkg/db"
)

func GetMaterialSourceId(ctx context.Context, materialName string, sourceName string) (int, error) {
	var id int
	materialId, err := GetMaterialId(ctx, materialName)
	if err != nil {
		return 0, err
	}

	sourceId, err := GetSourceId(ctx, sourceName)
	if err != nil {
		return 0, err
	}

	row, err := db.FromContext(ctx).Query(`SELECT id FROM material_source WHERE material_id=$1 AND
		source_id=$2'`, materialId, sourceId)
	if err != nil {
		return 0, err
	}

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}
