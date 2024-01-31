package repository

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/jackc/pgx/v5"
	"metallplace/internal/app/model"
	"metallplace/pkg/gopkg-db"
)

// AddMaterialSource Adding material - source - market - unit combo
func (r *Repository) AddMaterialSource(ctx context.Context, uid int, materialName, groupName, sourceName, market, unitName, deliveryTypeName string) (int, error) {
	var id int
	materialId, err := r.GetMaterialId(ctx, materialName)
	if err != nil {
		return 0, fmt.Errorf("can't get material id %w", err)
	}

	sourceId, err := r.GetSourceId(ctx, sourceName)
	if err != nil {
		return 0, fmt.Errorf("can't get source id %w", err)
	}

	groupId, err := r.GetGroupId(ctx, groupName)
	if err != nil {
		return 0, fmt.Errorf("can't get group id %w", err)
	}

	unitId, err := r.GetUnitId(ctx, unitName)
	if err != nil {
		return 0, fmt.Errorf("can't get unitName id %w", err)
	}

	deliveryTypeId, err := r.GetDeliveryTypeId(ctx, deliveryTypeName)
	if err != nil {
		return 0, fmt.Errorf("can't get delivery type  id %w", err)
	}

	id, err = r.GetMaterialSourceId(ctx, materialName, groupName, sourceName, market, unitName, deliveryTypeName)
	if err != nil {
		return 0, fmt.Errorf("cant get material-source id %w", err)
	}

	if id != 0 {
		return id, nil
	}

	// We usually set uid in parse markdown but if there wasn't any - we calculate it manually
	var finalUId int
	if uid == 0 {
		finalUId, err = r.GetMaxUId(ctx)
		finalUId++
		if err != nil {
			return 0, fmt.Errorf("cant get max uid: %w", err)
		}
	} else {
		exists, err := r.CheckIfUIdExists(ctx, uid)
		if err != nil {
			return 0, fmt.Errorf("cant check if uid exists: %w", err)
		}
		if !exists {
			finalUId = uid
		} else {
			return 0, fmt.Errorf("uid already exists: %d", uid)
		}
	}

	row := db.FromContext(ctx).QueryRow(
		ctx, `INSERT INTO material_source (uid, material_id, source_id, target_market, unit_id, delivery_type_id, material_group_id) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) 
		ON CONFLICT DO NOTHING RETURNING uid`,
		finalUId, materialId, sourceId, market, unitId, deliveryTypeId, groupId)

	err = row.Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("cant add material-source: %w", err)
	}

	return id, nil
}

func (r *Repository) GetMaxUId(ctx context.Context) (int, error) {
	var id sql.NullInt64
	row := db.FromContext(ctx).QueryRow(
		ctx, `SELECT MAX(uid) FROM material_source`)
	err := row.Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("can't get max uid: %w", err)
	}

	if !id.Valid {
		return 0, nil
	}

	return int(id.Int64), nil
}

func (r *Repository) CheckIfUIdExists(ctx context.Context, uid int) (bool, error) {
	var exists bool
	row := db.FromContext(ctx).QueryRow(
		ctx, `SELECT EXISTS(SELECT 1 FROM material_source WHERE uid = $1)`,
		uid)
	err := row.Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("can't check if entry exists: %w", err)
	}

	return exists, nil
}

// GetMaterialSourceId Get unique material-source combo by material and source name
func (r *Repository) GetMaterialSourceId(ctx context.Context, materialName, groupName, sourceName, market, unit, deliveryType string) (int, error) {
	var uid int
	materialId, err := r.GetMaterialId(ctx, materialName)
	if err != nil {
		return 0, fmt.Errorf("Can't get material id %w", err)
	}

	sourceId, err := r.GetSourceId(ctx, sourceName)
	if err != nil {
		return 0, fmt.Errorf("Can't get source id %w", err)
	}

	groupId, err := r.GetGroupId(ctx, groupName)
	if err != nil {
		return 0, fmt.Errorf("Can't get source id %w", err)
	}

	unitId, err := r.GetUnitId(ctx, unit)
	if err != nil {
		return 0, fmt.Errorf("Can't get unit id %w", err)
	}

	deliveryTypeId, err := r.GetDeliveryTypeId(ctx, deliveryType)
	if err != nil {
		return 0, fmt.Errorf("Can't get unit id %w", err)
	}

	row := db.FromContext(ctx).QueryRow(ctx, `SELECT uid FROM material_source WHERE material_id=$1 AND
		source_id=$2 AND target_market=$3 AND unit_id=$4 AND delivery_type_id=$5 AND material_group_id=$6`,
		materialId, sourceId, market, unitId, deliveryTypeId, groupId)

	err = row.Scan(&uid)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("Can't get material-source pair id %w", err)
	}

	return uid, nil
}

// GetMaterialSource Get material source by uid
func (r *Repository) GetMaterialSource(ctx context.Context, uid int) (model.MaterialShortInfo, error) {
	var materialId int
	var sourceId int
	var market string
	var unitId int
	var deliveryTypeId int

	row := db.FromContext(ctx).QueryRow(ctx, `SELECT material_id, source_id, target_market, delivery_type_id, unit_id 
		FROM material_source WHERE uid=$1`, uid)

	err := row.Scan(&materialId, &sourceId, &market, &deliveryTypeId, &unitId)
	if err != nil {
		return model.MaterialShortInfo{}, fmt.Errorf("can't get scan row %w", err)
	}

	materialName, err := r.GetMaterialName(ctx, materialId)
	if err != nil {
		return model.MaterialShortInfo{}, fmt.Errorf("can't get material name %w", err)
	}

	sourceName, err := r.GetSourceName(ctx, sourceId)
	if err != nil {
		return model.MaterialShortInfo{}, fmt.Errorf("can't get source name %w", err)
	}

	unitName, err := r.GetUnitName(ctx, unitId)
	if err != nil {
		return model.MaterialShortInfo{}, fmt.Errorf("can't get unit name %w: ", err)
	}

	deliveryTypeName, err := r.GetDeliveryTypeName(ctx, deliveryTypeId)
	if err != nil {
		return model.MaterialShortInfo{}, fmt.Errorf("can't get unit name %w: ", err)
	}

	return model.MaterialShortInfo{Id: uid, Name: materialName, Source: sourceName, Market: market, DeliveryType: deliveryTypeName, Unit: unitName}, nil
}
