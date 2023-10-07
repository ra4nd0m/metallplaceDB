package service

import (
	"context"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/config"
	"metallplace/pkg/chartclient"
	"metallplace/pkg/docxgenclient"
	"time"
)

// IRepository Interface for basic operation with DB
type IRepository interface {
	AddMaterial(ctx context.Context, materialName string) (int, error)
	GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error)
	GetMaterialId(ctx context.Context, materialName string) (int, error)
	GetMaterialName(ctx context.Context, materialId int) (string, error)

	AddMaterialProperty(ctx context.Context, uid int, propertyId int) error

	AddMaterialSource(ctx context.Context, uid int, materialName, groupName, sourceName, market, unit, deliveryType string) (int, error)
	GetMaterialSourceId(ctx context.Context, materialName, groupName, sourceName, market, unit, deliveryType string) (int, error)
	GetMaterialSource(ctx context.Context, id int) (model.MaterialShortInfo, error)
	GetDeliveryType(ctx context.Context, id int) (string, error)

	AddMaterialValue(ctx context.Context, uid int, propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error
	GetMaterialValueForPeriod(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error)
	GetNLastValues(ctx context.Context, uid, propertyId int, nValues int, finish string) ([]model.Price, error)

	AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error)
	GetPropertyId(ctx context.Context, propertyName string) (int, error)
	GetPropertyName(ctx context.Context, id int) (string, error)
	GetPropertyKind(ctx context.Context, propertyId int) (string, error)
	GetPropertyList(ctx context.Context, uid int) ([]model.PropertyShortInfo, error)

	AddSource(ctx context.Context, materialSource string) error
	GetSourceId(ctx context.Context, sourceName string) (int, error)
	GetSourceName(ctx context.Context, sourceId int) (string, error)

	CheckCredentials(ctx context.Context, user, password string) (bool, error)

	GetGroupId(ctx context.Context, groupName string) (int, error)
	AddGroupIfNotExists(ctx context.Context, group string) (int, error)
	GetGroupName(ctx context.Context, groupId int) (string, error)

	GetLastModified(ctx context.Context, table string) (time.Time, error)

	AddUnitIfNotExists(ctx context.Context, unit string) error
	GetUnitId(ctx context.Context, unitName string) (int, error)
	GetUnitName(ctx context.Context, unitId string) (string, error)
}

type IChartClient interface {
	GetChart(req chartclient.Request) ([]byte, error)
	GetChartTitled(req chartclient.Request) ([]byte, error)
}

type IDocxgenClient interface {
	GetReport(req docxgenclient.Request) ([]byte, error)
	GetShortReport(req docxgenclient.RequestShortReport) ([]byte, error)
}

type Service struct {
	cfg             config.Config
	repo            IRepository
	chart           IChartClient
	docxgen         IDocxgenClient
	lastRequestTime time.Time
}

func (s *Service) SetLastRequestTime(lastRequestTime time.Time) {
	s.lastRequestTime = lastRequestTime
}

func (s *Service) LastRequestTime() time.Time {
	return s.lastRequestTime
}

func New(cfg config.Config, r IRepository, chart IChartClient, docxgen IDocxgenClient, lastRequestTime time.Time) *Service {
	return &Service{cfg, r, chart, docxgen, lastRequestTime}
}
