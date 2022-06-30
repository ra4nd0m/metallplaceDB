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
	rows := d.DB.QueryRow(query, args...)
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return rows, nil
}

type Tx struct {
	*sql.Tx
}

func (tx *Tx) BeginTx(ctx context.Context, opts *sql.TxOptions) (*sql.Tx, error) {
	return tx.Tx, nil
}
func (tx *Tx) QueryRow(query string, args ...any) (*sql.Row, error) {
	rows := tx.Tx.QueryRow(query, args...)
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return rows, nil
}
