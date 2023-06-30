package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	db "metallplace/pkg/gopkg-db"
)

func (r *Repository) AddGroupIfNotExists(ctx context.Context, groupName string) (int, error) {
	id, err := r.GetGroupId(ctx, groupName)
	if err != nil {
		return 0, fmt.Errorf("cant get group id %w", err)
	}

	if id != 0 {
		return id, nil
	}

	row := db.FromContext(ctx).QueryRow(ctx, `INSERT INTO material_group (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id`,
		groupName,
	)

	err = row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (r *Repository) GetGroupId(ctx context.Context, groupName string) (int, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM material_group WHERE name=$1`, groupName)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("cant get group id: %w", err)
	}

	return id, nil
}

func (r *Repository) GetGroupName(ctx context.Context, groupId int) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM material_group WHERE id=$1`, groupId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("Can't get group name with row.Scan() %w", err)
	}

	return name, nil
}
