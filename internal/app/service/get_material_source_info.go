package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetMaterialSourceInfo(ctx context.Context, id int) (model.MaterialShortInfo, error) {
	return s.repo.GetMaterialSource(ctx, id)
}
