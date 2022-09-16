package service

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"metallplace/internal/app/model"
	"metallplace/pkg/chartclient"
	"os"
)

func (s *Service) GetChart(ctx context.Context, chartPack model.ChartPack) ([]byte, error) {
	var req chartclient.Request
	var isFirst = true

	for _, id := range chartPack.MaterialIdList {
		material, err := s.repo.GetMaterialSource(ctx, id)
		if err != nil {
			return nil, fmt.Errorf("cant get material_source: %w", err)
		}

		dataset := chartclient.YDataSet{Label: material.Name + ", " + material.Unit, Data: []float64{}}

		start := chartPack.Start.Format("2006-01-02")
		finish := chartPack.Finish.Format("2006-01-02")
		feed, _, err := s.repo.GetMaterialValueForPeriod(ctx, id, chartPack.PropertyId, start, finish)
		if err != nil {
			return nil, fmt.Errorf("cant get material_value: %w", err)
		}

		for _, item := range feed {
			dataset.Data = append(dataset.Data, item.Value)
			if isFirst {
				req.XLabelSet = append(req.XLabelSet, item.Date.Format("2006-01-02"))
			}
		}

		req.YDataSet = append(req.YDataSet, dataset)
		req.Options.NeedLabels = chartPack.NeedLabels
		req.Options.Type = chartPack.Type
		isFirst = false
	}

	bytes, err := s.chart.GetChart(req)
	if err != nil {
		return nil, fmt.Errorf("cant get chart bytes: %w", err)
	}
	return bytes, nil
}

func (s *Service) GetCachedChart(ctx context.Context, chartPack model.ChartPack) ([]byte, error) {
	path := "./var/cache/charts/" + chartPack.ToUrl()
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		bytes, err := s.GetChart(ctx, chartPack)
		if err != nil {
			return nil, fmt.Errorf("cant get generated chart from chart_service: %w", err)
		}

		f, err := os.Create(path)
		if err != nil {
			return nil, fmt.Errorf("cant create file for chart: %w", err)
		}

		_, err = f.Write(bytes)
		if err != nil {
			return nil, fmt.Errorf("cant cant write chart to file: %w", err)
		}

		f.Close()
		return bytes, nil
	}
	return ioutil.ReadFile(path)
}
