package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator"
	"github.com/xuri/excelize/v2"
	"io"
	"metallplace/internal/app/model"
	"metallplace/pkg/chartclient"
	"net/http"
	"reflect"
	"time"
)

type IService interface {
	InitialImport(ctx context.Context) error
	InitImportMaterialsVertical(ctx context.Context, book *excelize.File, dateLayout string) error
	InitImportMaterialsHorizontalWeekly(ctx context.Context, book *excelize.File) error
	InitImportDailyMaterials(ctx context.Context, book *excelize.File, dateLayout string) error
	//ParseRosStatBook(ctx context.Context, byte []byte) error
	ParseXlsxForChart(byte []byte) (chartclient.Request, error)
	InitialImportDaily(ctx context.Context) error

	AddMaterialProperty(ctx context.Context, uid, propertyId int) error
	AddValue(ctx context.Context, uid int,
		propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error
	AddUniqueMaterial(ctx context.Context, uid int, materialName string, groupName string, sourceName string, materialMarket string, materialUnit string, deliveryType string) (int, error)

	GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error)
	GetMaterialValueForPeriod(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error)
	GetMaterialSourceInfo(ctx context.Context, id int) (model.MaterialShortInfo, error)
	GetNLastValues(ctx context.Context, uid, propertyId int, nValues int, finish string) ([]model.Price, error)
	GetMonthlyAvgFeed(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error)
	GetWeeklyAvgFeed(ctx context.Context, materialSourceId, propertyId int, start string, finish string) ([]model.Price, float64, error)

	GetChart(ctx context.Context, chartPack model.ChartPack) ([]byte, error)
	GetCachedChart(ctx context.Context, chartPack model.ChartPack) ([]byte, error)
	GetChartRaw(book []byte, tickLimit int) ([]byte, error)

	GetReport(repType string, date string) ([]byte, error)
	GetShortReport(reportHeader string, date time.Time, blocks []model.ReportBlock) ([]byte, error)

	GetCachedReport(repType string, date string) ([]byte, error)

	GetPropertyList(ctx context.Context, uid int) ([]model.PropertyShortInfo, error)
	GetPropertyName(ctx context.Context, id int) (string, error)
	GetPropertyId(ctx context.Context, name string) (int, error)
	AddPropertyToMaterial(ctx context.Context, uid int, propertyName string, kind string) error
	AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error)

	CheckCredentials(ctx context.Context, user, password string) (bool, error)
	CreateToken(username string) (string, error)
	Authenticate(next http.HandlerFunc) http.HandlerFunc
	GetUserFromJWT(r *http.Request) (string, error)

	CheckChanges(ctx context.Context, table string, lastReqTime time.Time) (bool, error)
	LastRequestTime() time.Time
	SetLastRequestTime(lastRequestTime time.Time)
}

type Handler struct {
	service IService
}

func New(srv IService) *Handler {
	return &Handler{service: srv}
}

type ErrorResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func isNil(i interface{}) bool {
	if i == nil {
		return true
	}
	switch reflect.TypeOf(i).Kind() {
	case reflect.Ptr, reflect.Map, reflect.Array, reflect.Chan, reflect.Slice:
		return reflect.ValueOf(i).IsNil()
	}
	return false
}

// Unmarshal request, do work fn(), then marshall response into JSON anf return
func handle[REQ any, RESP any](w http.ResponseWriter, r *http.Request, fn func(req REQ) (RESP, error)) {
	var req REQ
	body, err := io.ReadAll(r.Body)
	if err != nil {
		toWriterError(&w, err, http.StatusBadRequest)
		return
	}

	if !isNil(req) {
		err = json.Unmarshal(body, &req)
		if err != nil {
			toWriterError(&w, err, http.StatusBadRequest)
			return
		}
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		toWriterError(&w, err, http.StatusBadRequest)
		return
	}

	resp, err := fn(req)
	if err != nil {
		toWriterError(&w, err, http.StatusInternalServerError)
		return
	}

	respJSON, err := json.Marshal(resp)
	if err != nil {
		toWriterError(&w, err, http.StatusInternalServerError)
		return
	}

	_, err = w.Write(respJSON)
	if err != nil {
		toWriterError(&w, err, http.StatusInternalServerError)
		return
	}
}

func toWriterError(w *http.ResponseWriter, er error, code int) {
	http.Error(*w, fmt.Sprintf("%+v", er), code)
}
