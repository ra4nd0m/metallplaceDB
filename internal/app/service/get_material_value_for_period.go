package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetMaterialValueForPeriod(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	return s.repo.GetMaterialValueForPeriod(ctx, uid, propertyId, start, finish)
}
