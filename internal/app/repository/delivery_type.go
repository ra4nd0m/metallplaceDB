package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
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
func (r *Repository) GetDeliveryTypeName(ctx context.Context, deliveryTypeId string) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM delivery_type WHERE id=$1`, deliveryTypeId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("can't get delivery type name with row.Scan() %w", err)
	}

	return name, nil
}
