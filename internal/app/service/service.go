package service

import (
	"context"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/config"
	"time"
)

// IRepository Interface for basic operation with DB
type IRepository interface {
	AddMaterial(ctx context.Context, materialName string) (int, error)
	GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error)
	GetMaterialId(ctx context.Context, materialName string) (int, error)
	GetMaterialName(ctx context.Context, materialId int) (string, error)

	AddMaterialProperty(ctx context.Context, materialId int, propertyId int) error

	AddMaterialSource(ctx context.Context, materialName, sourceName, materialMarket, materialUnit string) error
	GetMaterialSourceId(ctx context.Context, materialName, sourceName, market, unit string) (int, error)
	GetMaterialSource(ctx context.Context, id int) (model.MaterialShortInfo, error)

	AddMaterialValue(ctx context.Context, materialSourceId int, propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error
	GetMaterialValueForPeriod(ctx context.Context, materialSourceId, propertyId int, start string, finish string) ([]model.Price, error)
	GetNLastValues(ctx context.Context, materialSourceId int, nRows int) ([]model.Price, error)

	AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error)
	GetPropertyId(ctx context.Context, propertyName string) (int, error)

	AddSource(ctx context.Context, materialSource string) error
	GetSourceId(ctx context.Context, sourceName string) (int, error)
	GetSourceName(ctx context.Context, sourceId int) (string, error)
}

type Service struct {
	cfg  config.Config
	repo IRepository
}

func New(cfg config.Config, r IRepository) *Service {
	return &Service{cfg, r}
}
