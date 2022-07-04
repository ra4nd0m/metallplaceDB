package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func (r *Repository) GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error) {
	var materialList []model.MaterialShortInfo
	var materialId int
	var sourceId int
	var market string
	var unit string
	var id int

	rows, err := db.FromContext(ctx).Query(`SELECT id, material_id, source_id, target_market, unit FROM material_source`)
	if err != nil {
		return nil, fmt.Errorf("Can't get material_source rows %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		rows.Scan(&id, &materialId, &sourceId, &market, &unit)

		materialName, err := r.GetMaterialName(ctx, materialId)
		if err != nil {
			return nil, fmt.Errorf("Can't get material name %w", err)
		}

		sourceName, err := r.GetSourceName(ctx, sourceId)
		if err != nil {
			return nil, fmt.Errorf("Can't get source name %w", err)
		}
		materialList = append(materialList, model.MaterialShortInfo{id, materialName, sourceName, market, unit})
	}

	return materialList, nil
}
