package service

import (
	"context"
	"fmt"
)

// AddMaterialProperty Tying materials and properties
func (s *Service) AddMaterialProperty(ctx context.Context, materialSourceId, propertyId int) error {

	err := s.repo.AddMaterialProperty(ctx, materialSourceId, propertyId)
	if err != nil {
		return fmt.Errorf("Can't tie material id %w", err)
	}
	return nil
}
