package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	db "metallplace/pkg/gopkg-db"
)

// CheckCredentials Check username and password
func (r *Repository) CheckCredentials(ctx context.Context, user, password string) (bool, error) {
	var id int
	row := db.FromContext(ctx).QueryRow(ctx, `SELECT id FROM "user" WHERE username=$1 AND password=crypt($2, password)`, user, password)

	err := row.Scan(&id)
	if err == pgx.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, fmt.Errorf("error checking user's credentials from db: %w", err)
	}
	return true, nil
}
