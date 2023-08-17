package service

import (
	"context"
	"fmt"
)

// AddUniqueMaterial adding material with unique set of data (name - source - market - unit of sale)
func (s *Service) AddUniqueMaterial(ctx context.Context, uid int, materialName string, groupName string, sourceName string, materialMarket string, materialUnit string, deliveryType string) error {
	// Adding source
	err := s.repo.AddSource(ctx, sourceName)
	if err != nil {
		return fmt.Errorf("Can't add source %w", err)
	}

	// Adding material and getting id of it
	_, err = s.repo.AddMaterial(ctx, materialName)
	if err != nil {
		return fmt.Errorf("Can't add material %w", err)
	}

	_, err = s.repo.AddGroupIfNotExists(ctx, groupName)
	if err != nil {
		return fmt.Errorf("Can't add material %w", err)
	}

	// tying material, source, unit and market - creating unique material
	_, err = s.repo.AddMaterialSource(ctx, uid, materialName, groupName, sourceName, materialMarket, materialUnit, deliveryType)

	if err != nil {
		return fmt.Errorf("cant tie material, source, unit and market (%s, %s) %w", materialName, groupName, err)
	}

	return nil
}
