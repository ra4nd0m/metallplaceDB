package main

import (
	"context"
	"database/sql"
	"log"
	"metallplace/internal/app/pkg/config"
	"metallplace/internal/app/repository"
	"metallplace/internal/app/service"
	"metallplace/internal/pkg/db"
)

var conn *sql.DB

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("cannot load cfg:", err)
	}

	conn = db.New(cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)
	ctx := db.AddToContext(context.Background(), &db.Db{DB: conn})

	repo := repository.New()
	srv := service.New(repo)

	err = srv.InitialImport(ctx)
	if err != nil {
		log.Fatal("cannot import materials:", err)
	}
}
