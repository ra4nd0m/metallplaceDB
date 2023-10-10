package service

import (
	"context"
	"metallplace/internal/app/model"
)

func (s *Service) GetDeliveryTypeId(ctx context.Context, name string) (int, error) {
	return s.repo.GetDeliveryTypeId(ctx, name)
}

func (s *Service) GetDeliveryTypeName(ctx context.Context, id int) (string, error) {
	return s.repo.GetDeliveryTypeName(ctx, id)
}

func (s *Service) GetDeliveryTypeList(ctx context.Context) ([]model.DeliveryTypeInfo, error) {
	return s.repo.GetDeliveryTypeList(ctx)
}
