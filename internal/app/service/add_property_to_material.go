package service

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
)

func (s *Service) AddPropertyToMaterial(ctx context.Context, uid int, propertyName string, kind string) error {
	propertyId, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Id: 0, Name: propertyName, Kind: kind})
	if err != nil {
		return fmt.Errorf("cant add property: %w", err)
	}

	err = s.AddMaterialProperty(ctx, uid, propertyId)
	if err != nil {
		return fmt.Errorf("cant add property to material: %w", err)
	}
	return nil
}
