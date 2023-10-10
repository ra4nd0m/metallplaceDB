package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetUnitId(ctx context.Context, name string) (int, error) {
	return s.repo.GetUnitId(ctx, name)
}

func (s *Service) GetUnitName(ctx context.Context, id int) (string, error) {
	return s.repo.GetUnitName(ctx, id)
}

func (s *Service) GetUnitList(ctx context.Context) ([]model.UnitInfo, error) {
	return s.repo.GetUnitList(ctx)
}
