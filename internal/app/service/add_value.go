package service

import (
	"context"
	"fmt"
	"time"
)

// AddValue Adding property value to the specific material combo (material-source)
func (s *Service) AddValue(ctx context.Context, materialName string, sourceName string,
	propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {

	err := s.repo.AddMaterialValue(ctx, materialName, sourceName, propertyName, valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}
