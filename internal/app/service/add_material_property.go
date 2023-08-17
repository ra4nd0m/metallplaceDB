package service

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
)

// AddMaterialProperty Tying materials and properties
func (s *Service) AddMaterialProperty(ctx context.Context, uid, propertyId int) error {

	err := s.repo.AddMaterialProperty(ctx, uid, propertyId)
	if err != nil {
		return fmt.Errorf("Can't tie material id %w", err)
	}
	return nil
}

func (s *Service) AddPropertyIfNotExists(ctx context.Context, property model.PropertyShortInfo) (int, error) {
	return s.repo.AddPropertyIfNotExists(ctx, property)
}
