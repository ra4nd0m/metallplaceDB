package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetNLastValues(ctx context.Context, uid, propertyId int, nValues int, finish string) ([]model.Price, error) {
	return s.repo.GetNLastValues(ctx, uid, propertyId, nValues, finish)
}
