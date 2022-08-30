package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetNLastValues(ctx context.Context, materialSourceId, propertyId int, nValues int) ([]model.Price, error) {
	return s.repo.GetNLastValues(ctx, materialSourceId, propertyId, nValues)
}
