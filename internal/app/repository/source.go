package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v4"
	"metallplace/pkg/gopkg-db"
)

func (r *Repository) AddSource(ctx context.Context, materialSource string) error {
	id, err := r.GetSourceId(ctx, materialSource)
	if err != nil {
		return err
	}
	if id != 0 {
		return nil
	}

	_, err = db.FromContext(ctx).Exec(
		ctx, `INSERT INTO source (name, url) VALUES ($1, $1)`, materialSource)
	if err != nil {
		return fmt.Errorf("Can't add source %w", err)
	}
	return nil
}

// GetSourceId Get id by name
func (r *Repository) GetSourceId(ctx context.Context, sourceName string) (int, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM source WHERE name=$1`, sourceName)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("Can't get source id with row.Scan() %w", err)
	}

	return id, nil
}

// GetSourceName Get name by id
func (r *Repository) GetSourceName(ctx context.Context, sourceId int) (string, error) {
	var name string
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT name FROM source WHERE id=$1`, sourceId)

	err := row.Scan(&name)
	if err != nil {
		return "", fmt.Errorf("Can't get source name with row.Scan() %w", err)
	}

	return name, nil
}
