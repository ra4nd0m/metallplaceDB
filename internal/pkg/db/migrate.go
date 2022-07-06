package db

import (
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func MigrateUp(path, host string, port int, user, password, name string) error {
	m, err := migrate.New(
		"file://"+path,
		fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
			user, password, host, port, name))
	if err != nil {
		return fmt.Errorf("cannot init migrate: %w", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("cannot up migrate: %w", err)
	}
	return nil
}
