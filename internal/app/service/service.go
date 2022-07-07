package service

import (
	"context"
	"metallplace/internal/app/model"
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
	GetMaterialSourceId(ctx context.Context, materialName string, sourceName string) (int, error)

	AddMaterialValue(ctx context.Context, materialName, sourceName, propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error
	GetMaterialValueForPeriod(ctx context.Context, materialSourceId int, start string, finish string) ([]model.Price, error)

	AddProperty(ctx context.Context, property model.Property) (int, error)
	GetPropertyId(ctx context.Context, propertyName string) (int, error)

	AddSource(ctx context.Context, materialSource string) error
	GetSourceId(ctx context.Context, sourceName string) (int, error)
	GetSourceName(ctx context.Context, sourceId int) (string, error)
}

type Service struct {
	repo IRepository
}

func New(r IRepository) *Service {
	return &Service{r}
}
