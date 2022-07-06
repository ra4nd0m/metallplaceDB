package db

import (
	"context"
	"database/sql"
)

type Conn interface {
	Exec(query string, args ...any) (sql.Result, error)
	Query(query string, args ...any) (*sql.Rows, error)
	QueryRow(query string, args ...any) (*sql.Row, error)
	Commit() error
	Rollback() error
	BeginTx(ctx context.Context, opts *sql.TxOptions) (*sql.Tx, error)
}

type Db struct {
	*sql.DB
}

func (d *Db) Commit() error {
	return nil
}
func (d *Db) Rollback() error {
	return nil
}
func (d *Db) QueryRow(query string, args ...any) (*sql.Row, error) {
	row := d.DB.QueryRow(query, args...)
	if row.Err() == sql.ErrNoRows {
		return nil, nil
	}
	if row.Err() != nil {
		return nil, row.Err()
	}
	return row, nil
}

type Tx struct {
	*sql.Tx
}

func (tx *Tx) BeginTx(ctx context.Context, opts *sql.TxOptions) (*sql.Tx, error) {
	return tx.Tx, nil
}
func (tx *Tx) QueryRow(query string, args ...any) (*sql.Row, error) {
	row := tx.Tx.QueryRow(query, args...)
	if row.Err() == sql.ErrNoRows {
		return nil, nil
	}
	if row.Err() != nil {
		return nil, row.Err()
	}
	return row, nil
}
