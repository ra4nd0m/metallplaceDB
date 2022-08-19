package service

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
)

func (s *Service) GetChart(ctx context.Context, chartPack model.ChartPack) (string, error) {
	var feeds []model.PriceFeed
	var names []string

	for id := range chartPack.MaterialIdList {
		material, err := s.repo.GetMaterialSource(ctx, id)
		if err != nil {
			return "", fmt.Errorf("cant get material_source: %w", err)
		}

		names = append(names, material.Name+", "+material.Unit)

		start := chartPack.Start.Format("2006-01-02")
		finish := chartPack.Finish.Format("2006-01-02")
		feed, err := s.repo.GetMaterialValueForPeriod(ctx, id, chartPack.PropertyId, start, finish)
		if err != nil {
			return "", fmt.Errorf("cant get material_value: %w", err)
		}

		feeds = append(feeds, model.PriceFeed{Feed: feed})
	}

	return "", nil
}
