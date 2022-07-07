package service

import (
	"context"
	"fmt"
	"time"
)

// AddValue Adding property value to the specific material combo (material-source)
func (s *Service) AddValue(ctx context.Context, materialName string, sourceName string,
	propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {

	materialSourceId, err := s.repo.GetMaterialSourceId(ctx, materialName, sourceName)
	if err != nil {
		return fmt.Errorf("Can't get source id %w", err)
	}

	propertyId, err := s.repo.GetPropertyId(ctx, propertyName)
	if err != nil {
		return err
	}

	err = s.repo.AddMaterialValue(ctx, materialSourceId, propertyId, valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}
