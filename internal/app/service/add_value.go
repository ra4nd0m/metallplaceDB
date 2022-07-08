package service

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"time"
)

// AddValue Adding property value to the specific material combo (material-source)
func (s *Service) AddValue(ctx context.Context, materialName string, sourceName string,
	propertyName string, valueFloat float64, valueStr string, createdOn time.Time) error {
	var valueType string

	if valueStr == "" {
		valueType = "decimal"
	} else {
		valueType = "string"
	}
	_, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Name: propertyName, Kind: valueType})

	err = s.repo.AddMaterialValue(ctx, materialName, sourceName, propertyName, valueFloat, valueStr, createdOn)
	if err != nil {
		return fmt.Errorf("Can't add value %w", err)
	}

	return nil
}
