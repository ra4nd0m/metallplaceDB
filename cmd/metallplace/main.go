package main

import (
	"bytes"
	//"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"image"
	"image/png"
	//"io/ioutil"
	"log"
	"metallplace/internal/app/handler"
	"metallplace/internal/app/repository"
	"metallplace/internal/app/service"
	"metallplace/internal/pkg/config"
	"metallplace/pkg/chartclient"
	"metallplace/pkg/docxgenclient"
	db "metallplace/pkg/gopkg-db"
	"net/http"
	"os"
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
	chart := chartclient.New(cfg.ChartHost, cfg.ChartPort)
	docxgen := docxgenclient.New(cfg.DocxgenHost, cfg.DocxgenPort)
	srv := service.New(cfg, repo, chart, docxgen)
	hdl := handler.New(srv)
	//byte, err := ioutil.ReadFile("/home/olga/go/src/metallplace/var/cache/books/LongW_2212.xlsx")
	//j, err := srv.ParseBook(byte)
	//if err != nil {
	//	fmt.Errorf("cant read book: %v", err)
	//}
	//fmt.Println(j)
	//picByte, err := srv.GetChartRaw(j)
	//serveFrames(picByte)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8081"},
		AllowCredentials: true,
	})
	router := mux.NewRouter()

	// Setting timeout for the server
	server := &http.Server{
		Addr:         ":" + cfg.HttpPort,
		ReadTimeout:  600 * time.Second,
		WriteTimeout: 600 * time.Second,
		Handler:      c.Handler(router),
	}

	// Linking addresses and handlers
	for _, rec := range [...]struct {
		route   string
		handler http.HandlerFunc
	}{
		{route: "/getValueForPeriod", handler: hdl.GetValueForPeriodHandler},
		{route: "/getMonthlyAvgFeed", handler: hdl.GetMonthlyAvgHandler},
		{route: "/getWeeklyAvgFeed", handler: hdl.GetWeeklyAvgHandler},
		{route: "/getMaterialList", handler: hdl.GetMaterialListHandler},
		{route: "/addValue", handler: hdl.AddValueHandler},
		{route: "/addUniqueMaterial", handler: hdl.AddUniqueMaterialHandler},
		{route: "/initImport", handler: hdl.InitImportHandler},
		{route: "/getNLastValues", handler: hdl.GetNLastValues},
		{route: "/getChart/{specs}", handler: hdl.GetChartHandler},
		{route: "/getReport/{repType}/{date}", handler: hdl.GetReportHandler},
		{route: "/getPropertyList", handler: hdl.GetPropertyListHandler},
		{route: "/getMaterialInfo", handler: hdl.GetMaterialSourceInfoHandler},
		{route: "/getPropertyName", handler: hdl.GetPropertyNameHandler},
		{route: "/addPropertyToMaterial", handler: hdl.AddPropertyToMaterialHandler},
	} {
		router.HandleFunc(rec.route, DbMiddleware(rec.handler))
	}

	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("./web"))))

	http.Handle("/", router)

	log.Printf("Server started on port %s \n", cfg.HttpPort)

	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err.Error())
	}

}

func DbMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		r = r.WithContext(db.AddToContext(ctx, conn))
		next.ServeHTTP(w, r)
	}
}

func serveFrames(imgByte []byte) {
	img, _, err := image.Decode(bytes.NewReader(imgByte))
	if err != nil {
		log.Fatalln(err)
	}

	out, _ := os.Create("/home/olga/go/src/metallplace/var/cache/books/img.jpeg")
	defer out.Close()

	err = png.Encode(out, img)
	if err != nil {
		log.Println(err)
	}
}
