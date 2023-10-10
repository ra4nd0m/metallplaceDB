package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"metallplace/internal/app/model"
	db "metallplace/pkg/gopkg-db"
)

// AddDeliveryTypeIfNotExists Add new delivery type
func (r *Repository) AddDeliveryTypeIfNotExists(ctx context.Context, deliveryType string) error {
	id, err := r.GetDeliveryTypeId(ctx, deliveryType)
	if err != nil {
		return err
	}
	if id != 0 {
		return nil
	}

	_, err = db.FromContext(ctx).Exec(
		ctx, `INSERT INTO delivery_type (name) VALUES ($1)`, deliveryType)
	if err != nil {
		return fmt.Errorf("can't add delivery type %w", err)
	}
	return nil
}

// GetDeliveryTypeId Get delivery type id by name
func (r *Repository) GetDeliveryTypeId(ctx context.Context, deliveryTypeName string) (int, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM delivery_type WHERE name=$1`, deliveryTypeName)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("can't get delivery type id with row.Scan() %w", err)
	}

	return id, nil
}

// GetDeliveryTypeName Get the unit name by id
func (r *Repository) GetDeliveryTypeName(ctx context.Context, deliveryTypeId int) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM delivery_type WHERE id=$1`, deliveryTypeId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("can't get delivery type name with row.Scan() %w", err)
	}

	return name, nil
}

func (r *Repository) GetDeliveryTypeList(ctx context.Context) ([]model.DeliveryTypeInfo, error) {
	var list []model.DeliveryTypeInfo

	rows, err := db.FromContext(ctx).Query(ctx, `SELECT id, name FROM delivery_type`)
	if err != nil {
		return nil, fmt.Errorf("can't get delivery type list rows %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name string
		err = rows.Scan(&id, &name)
		if err != nil {
			return nil, fmt.Errorf("cant scan rows while getting delivery type list: %w", err)
		}
		list = append(list, model.DeliveryTypeInfo{Id: id, Name: name})
	}
	return list, nil
}
