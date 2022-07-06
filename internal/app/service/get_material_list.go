package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetMaterialList(ctx context.Context) ([]model.MaterialShortInfo, error) {
	return s.repo.GetMaterialList(ctx)
}
