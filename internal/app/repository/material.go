package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"metallplace/internal/app/model"
	"metallplace/pkg/gopkg-db"
)

// AddMaterial and get its id back
func (r *Repository) AddMaterial(ctx context.Context, materialName string) (int, error) {
	id, err := r.GetMaterialId(ctx, materialName)
	if err != nil {
		return 0, fmt.Errorf("Cant get material id %w", err)
	}

	if id != 0 {
		return id, nil
	}

	row := db.FromContext(ctx).QueryRow(ctx,
		`INSERT INTO material (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id`,
		materialName)

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

// GetMaterialId Get material id by material name
func (r *Repository) GetMaterialId(ctx context.Context, materialName string) (int, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM material WHERE name=$1`, materialName)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("Can't get material id with row.Scan() %w", err)
	}

	return id, nil
}

// GetMaterialName Get material name by material id
func (r *Repository) GetMaterialName(ctx context.Context, materialId int) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM material WHERE id=$1`, materialId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("Can't get material name with row.Scan() %w", err)
	}

	return name, nil
}

// GetMaterialList Get list of all material-source-market-unit existing combos
func (r *Repository) GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error) {
	var materialList []model.MaterialShortInfo
	var materialId int
	var sourceId int
	var groupId int
	var market string
	var unitId int
	var id int
	var deliveryTypeId int

	rows, err := db.FromContext(ctx).Query(ctx, `SELECT uid, material_id, source_id, target_market, delivery_type_id, unit_id, material_group_id FROM material_source`)
	if err != nil {
		return nil, fmt.Errorf("Can't get material_source rows %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&id, &materialId, &sourceId, &market, &deliveryTypeId, &unitId, &groupId)
		if err != nil {
			return nil, fmt.Errorf("cant scan from material row: %w", err)
		}

		materialName, err := r.GetMaterialName(ctx, materialId)
		if err != nil {
			return nil, fmt.Errorf("cant get material name (id %d) %w", materialId, err)
		}

		groupName, err := r.GetGroupName(ctx, groupId)
		if err != nil {
			return nil, fmt.Errorf("cant get material name (id %d) %w", materialId, err)
		}

		sourceName, err := r.GetSourceName(ctx, sourceId)
		if err != nil {
			return nil, fmt.Errorf("Can't get source name %w", err)
		}

		unitName, err := r.GetUnitName(ctx, unitId)
		if err != nil {
			return nil, fmt.Errorf("cant get unit name: %w", err)
		}

		deliveryTypeName, err := r.GetDeliveryTypeName(ctx, deliveryTypeId)
		if err != nil {
			return nil, fmt.Errorf("cant get delivery type name: %w", err)
		}

		materialList = append(materialList, model.MaterialShortInfo{Id: id, Name: materialName,
			Group: groupName, Source: sourceName, Market: market, DeliveryType: deliveryTypeName, Unit: unitName})
	}

	return materialList, nil
}
