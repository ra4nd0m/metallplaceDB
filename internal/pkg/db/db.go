package db

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
)

const ctxName = "db"

func AddToContext(ctx context.Context, conn Conn) context.Context {
	return context.WithValue(ctx, ctxName, conn)
}

func ExecTx(ctx context.Context, fn func(ctx context.Context) error) error {
	conn := FromContext(ctx)
	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	if err := fn(AddToContext(ctx, &Tx{Tx: tx})); err != nil {
		if err := tx.Rollback(); err != nil {
			return err
		}
		return err
	}

	return tx.Commit()
}

func FromContext(ctx context.Context) Conn {
	conn, ok := ctx.Value(ctxName).(Conn)
	if !ok {
		panic("Not found db in context")
	}
	return conn
}

func New(host string, port int, user, password, name string) *sql.DB {
	// Configuring connection
	psqlInfo := fmt.Sprintf("host=%v port=%d user=%v "+
		"password=%v dbname=%v sslmode=disable",
		host, port, user, password, name)

	// Opening a connection
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}
	db.SetMaxOpenConns(50)

	return db
}
