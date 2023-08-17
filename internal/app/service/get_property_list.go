package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetPropertyList(ctx context.Context, uid int) ([]model.PropertyShortInfo, error) {
	return s.repo.GetPropertyList(ctx, uid)
}
