package service

import (
	"context"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/config"
	"metallplace/pkg/chartclient"
	"time"
)

// IRepository Interface for basic operation with DB
type IRepository interface {
	AddMaterial(ctx context.Context, materialName string) (int, error)
	GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error)
	GetMaterialId(ctx context.Context, materialName string) (int, error)
	GetMaterialName(ctx context.Context, materialId int) (string, error)

	AddMaterialProperty(ctx context.Context, materialSourceId int, propertyId int) error

	AddMaterialSource(ctx context.Context, materialName, sourceName, market, unit string) (int, error)
	GetMaterialSourceId(ctx context.Context, materialName, sourceName, market, unit string) (int, error)
	GetMaterialSource(ctx context.Context, id int) (model.MaterialShortInfo, error)

	AddMaterialValue(ctx context.Context, materialSourceId int, propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error
	GetMaterialValueForPeriod(ctx context.Context, materialSourceId, propertyId int, start string, finish string) ([]model.Price, float64, error)
	GetNLastValues(ctx context.Context, materialSourceId, propertyId int, nValues int, finish string) ([]model.Price, error)

	AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error)
	GetPropertyId(ctx context.Context, propertyName string) (int, error)
	GetPropertyKind(ctx context.Context, propertyId int) (string, error)
	GetPropertyList(ctx context.Context, materialSourceId int) ([]model.PropertyShortInfo, error)

	AddSource(ctx context.Context, materialSource string) error
	GetSourceId(ctx context.Context, sourceName string) (int, error)
	GetSourceName(ctx context.Context, sourceId int) (string, error)
}

type IChartClient interface {
	GetChart(req chartclient.Request) ([]byte, error)
}

type Service struct {
	cfg   config.Config
	repo  IRepository
	chart IChartClient
}

func New(cfg config.Config, r IRepository, chart IChartClient) *Service {
	return &Service{cfg, r, chart}
}
