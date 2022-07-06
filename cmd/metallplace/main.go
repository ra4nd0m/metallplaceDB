package main

import (
	"database/sql"
	"log"
	"metallplace/internal/app/handler"
	"metallplace/internal/app/pkg/config"
	"metallplace/internal/app/repository"
	"metallplace/internal/app/service"
	"metallplace/internal/pkg/db"
	"net/http"
	"time"
)

var conn *sql.DB

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("cannot load cfg:", err)
	}

	conn = db.New(cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	if err := db.MigrateUp("internal/migrations", cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName); err != nil {
		log.Fatal("cannot migrate", err)
	}

	repo := repository.New()
	srv := service.New(repo)
	hdl := handler.New(srv)

	server := &http.Server{
		Addr:         ":" + cfg.HttpPort,
		ReadTimeout:  600 * time.Second,
		WriteTimeout: 600 * time.Second,
	}

	for _, rec := range [...]struct {
		route   string
		handler http.HandlerFunc
	}{
		{route: "/getValueForPeriod", handler: hdl.GetValueForPeriodHandler},
		{route: "/getMaterials", handler: hdl.GetMaterialHandler},
		{route: "/addValue", handler: hdl.AddValueHandler},
		{route: "/addUniqueMaterial", handler: hdl.AddUniqueMaterial},
		{route: "/initImport", handler: hdl.InitImport},
	} {
		http.HandleFunc(rec.route, DbMiddleware(rec.handler))
	}

	log.Printf("Server started on port %s \n", cfg.HttpPort)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err.Error())
	}

}

func DbMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		next(w, r.WithContext(db.AddToContext(r.Context(), &db.Db{conn})))
	}
}
