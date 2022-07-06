package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetMaterialValueForPeriod(ctx context.Context, materialSourceId int, start string, finish string) ([]model.Price, error) {
	return s.repo.GetMaterialValueForPeriod(ctx, materialSourceId, start, finish)
}
