package service

import (
	"context"
	"metallplace/internal/app/model"
	"time"
)

type IRepository interface {
	AddMaterialAndSource(ctx context.Context, material model.Material) error
	AddProperties(ctx context.Context, material model.Material, properties []model.Property) error
	AddValue(ctx context.Context, materialName string, sourceName string,
		propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error
	GetMaterialId(ctx context.Context, materialName string) (int, error)
	GetMaterialSourceId(ctx context.Context, materialName string, sourceName string) (int, error)
	GetPropertyId(ctx context.Context, propertyName string) (int, error)
	GetSourceId(ctx context.Context, sourceName string) (int, error)
	GetPricesForPeriod(ctx context.Context, materialSourceId int, start string, finish string) ([]model.Price, error)
	GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error)
}

type Service struct {
	repo IRepository
}

func New(r IRepository) *Service {
	return &Service{r}
}
