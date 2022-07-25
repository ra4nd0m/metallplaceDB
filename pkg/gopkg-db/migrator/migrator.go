package migrator

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func New(host string, port int, user, password, name string) (*Migrator, error) {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", user, password, host, port, name)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return nil, err
	}
	return &Migrator{
		driver: driver,
		dir:    "internal/migrations",
	}, nil
}

type Migrator struct {
	driver database.Driver
	dir    string
}

func (m *Migrator) Up() error {
	log.Printf("Rolling up migration from dir: %v\n", m.dir)
	mig, err := migrate.NewWithDatabaseInstance("file://"+m.dir, "postgres", m.driver)
	if err != nil {
		return err
	}
	err = mig.Up()
	if err == migrate.ErrNoChange {
		log.Printf("Database doesn't change\n")
		return nil
	}
	return err
}
