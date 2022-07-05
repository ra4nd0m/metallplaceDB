package main

import (
	"context"
	"database/sql"
	"github.com/xuri/excelize/v2"
	"log"
	"metallplace/internal/app/model"
	"metallplace/internal/app/pkg/config"
	"metallplace/internal/app/repository"
	"metallplace/internal/app/service"
	"metallplace/internal/pkg/db"
	"net/http"
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

	book, err := excelize.OpenFile("var/analytics.xlsx")
	if err != nil {
		log.Fatal("cannot convert to excelize file:", err)
	}

	err = srv.InitialImport(ctx, book, model.InitMaterials)
	if err != nil {
		log.Fatal("cannot import materials:", err)
	}
}

func DbMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		next(w, r.WithContext(db.AddToContext(r.Context(), &db.Db{conn})))
	}
}
