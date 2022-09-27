package service

import (
	"context"
	"fmt"
)

// AddUniqueMaterial adding material with unique set of data (name - source - market - unit of sale)
func (s *Service) AddUniqueMaterial(ctx context.Context, materialName string, sourceName string, materialMarket string, materialUnit string) (int, error) {
	// Adding source
	err := s.repo.AddSource(ctx, sourceName)
	if err != nil {
		return 0, fmt.Errorf("Can't add source %w", err)
	}

	// Adding material and getting id of it
	_, err = s.repo.AddMaterial(ctx, materialName)
	if err != nil {
		return 0, fmt.Errorf("Can't add material %w", err)
	}

	// tying material, source, unit and market - creating unique material
	materialSourceId, err := s.repo.AddMaterialSource(ctx, materialName, sourceName, materialMarket, materialUnit)

	if err != nil {
		return 0, fmt.Errorf("Can't tie material, source, unit and market %w", err)
	}

	return materialSourceId, nil
}
