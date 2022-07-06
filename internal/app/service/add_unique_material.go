package service

import (
	"context"
	"fmt"
)

// AddUniqueMaterial Adding source and product name if not exists, the tying them by id in Material_Source
func (s *Service) AddUniqueMaterial(ctx context.Context, materialName string, sourceName string, materialMarket string, materialUnit string) (int, error) {
	err := s.repo.AddSource(ctx, sourceName)
	if err != nil {
		return 0, fmt.Errorf("Can't add source %w", err)
	}

	materialId, err := s.repo.AddMaterial(ctx, materialName)
	if err != nil {
		return 0, fmt.Errorf("Can't add material %w", err)
	}

	// tying material, source, unit and market - creating unique material
	err = s.repo.AddMaterialSource(ctx, materialName, sourceName, materialMarket, materialUnit)

	if err != nil {
		return 0, fmt.Errorf("Can't tie material, source, unit and market %w", err)
	}

	return materialId, nil
}
