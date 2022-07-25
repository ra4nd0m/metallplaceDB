package main

import (
	"log"
	"metallplace/internal/app/handler"
	"metallplace/internal/app/pkg/config"
	"metallplace/internal/app/repository"
	"metallplace/internal/app/service"
	"metallplace/pkg/gopkg-db"
	"net/http"
	"time"
)

var conn db.IClient

func main() {
	// Loading config
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("cannot load cfg:", err)
	}

	// Creating connection to DB
	conn, err = db.New(cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	// Creating instances and setting inheritance
	repo := repository.New()
	srv := service.New(repo)
	hdl := handler.New(srv)

	// Setting timeout for the server
	server := &http.Server{
		Addr:         ":" + cfg.HttpPort,
		ReadTimeout:  600 * time.Second,
		WriteTimeout: 600 * time.Second,
	}

	// Linking addresses and handlers
	for _, rec := range [...]struct {
		route   string
		handler http.HandlerFunc
	}{
		{route: "/getValueForPeriod", handler: hdl.GetValueForPeriodHandler},
		{route: "/getMaterials", handler: hdl.GetMaterialHandler},
		{route: "/addValue", handler: hdl.AddValueHandler},
		{route: "/addUniqueMaterial", handler: hdl.AddUniqueMaterialHandler},
		{route: "/initImport", handler: hdl.InitImport},
		{route: "/getNLastValues", handler: hdl.GetNLastValues},
	} {
		http.HandleFunc(rec.route, DbMiddleware(rec.handler))
	}

	bindFrontend()
	log.Printf("Server started on port %s \n", cfg.HttpPort)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err.Error())
	}

}

func bindFrontend() {
	fs := http.FileServer(http.Dir("./web"))
	http.Handle("/", http.StripPrefix("/", fs))
}

func DbMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		r = r.WithContext(db.AddToContext(ctx, conn))
		next.ServeHTTP(w, r)
	}
}
