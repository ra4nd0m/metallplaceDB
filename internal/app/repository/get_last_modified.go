package repository

import (
	"context"
	"database/sql"
	"fmt"
	db "metallplace/pkg/gopkg-db"
	"time"
)

func (r *Repository) GetLastModified(ctx context.Context, table string) (time.Time, error) {
	var lastModified time.Time
	var dest sql.NullTime

	sqlReq := "SELECT MAX(max_last_updated) FROM (SELECT MAX(last_updated) AS max_last_updated FROM " + table + ") updates"
	rows, err := db.FromContext(ctx).Query(ctx, sqlReq)
	defer rows.Close()

	if err != nil {
		return time.Time{}, fmt.Errorf("cant scan rows for last modified: %v", err)
	}

	for rows.Next() {
		err := rows.Scan(&dest)
		if err != nil {
			return time.Time{}, fmt.Errorf("error scanning last modified row: %v", err)
		}
		if dest.Valid {
			lastModified = dest.Time
		} else {
			return time.Time{}, fmt.Errorf("last modified is null")
		}
	}

	return lastModified, nil
}
