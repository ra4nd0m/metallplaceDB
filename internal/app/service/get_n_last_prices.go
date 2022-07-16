package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetNLastValues(ctx context.Context, materialSourceId int, nValues int) ([]model.Price, error) {
	return s.repo.GetNLastValues(ctx, materialSourceId, nValues)
}
