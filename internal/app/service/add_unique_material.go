package service

import (
	"context"
)

// AddUniqueMaterial Adding source and product name if not exists, the tying them by id in Material_Source
func (s *Service) AddUniqueMaterial(ctx context.Context, materialName string, materialSource string, materialMarket string, materialUnit string) error {
	return s.repo.AddUniqueMaterial(ctx, materialName, materialSource, materialMarket, materialUnit)
}
