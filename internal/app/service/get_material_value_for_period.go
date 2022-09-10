package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetMaterialValueForPeriod(ctx context.Context, materialSourceId, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	return s.repo.GetMaterialValueForPeriod(ctx, materialSourceId, propertyId, start, finish)
}
