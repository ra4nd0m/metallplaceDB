package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetPropertyList(ctx context.Context, materialSourceId int) ([]model.PropertyShortInfo, error) {
	return s.repo.GetPropertyList(ctx, materialSourceId)
}
