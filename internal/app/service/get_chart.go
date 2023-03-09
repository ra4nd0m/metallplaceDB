package service

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"metallplace/internal/app/model"
	"metallplace/pkg/chartclient"
	"os"
	"strings"
)

func (s *Service) GetChart(ctx context.Context, chartPack model.ChartPack) ([]byte, error) {
	var req chartclient.Request
	var isFirst = true

	for _, id := range chartPack.MaterialIdList {
		material, err := s.repo.GetMaterialSource(ctx, id)
		if err != nil {
			return nil, fmt.Errorf("cant get material_source: %w", err)
		}

		nameArr := strings.Split(material.Name, ", ")
		name := nameArr[0] + " (" + strings.Join(nameArr[1:], " ") + ")"
		if chartPack.Type == "bar" {
			name += ", " + material.Unit
		}

		dataset := chartclient.YDataSet{Label: name, Data: []float64{}}

		start := chartPack.Start.Format("2006-01-02")
		finish := chartPack.Finish.Format("2006-01-02")
		var feed []model.Price
		switch chartPack.Scale {
		case "day":
			feed, _, err = s.repo.GetMaterialValueForPeriod(ctx, id, chartPack.PropertyId, start, finish)
			if err != nil {
				return nil, fmt.Errorf("cant get material_value: %w", err)
			}
		case "month":
			feed, _, err = s.GetMonthlyAvgFeed(ctx, id, chartPack.PropertyId, start, finish)
			if err != nil {
				return nil, fmt.Errorf("cant get material_value: %w", err)
			}
		case "week":
			feed, _, err = s.GetWeeklyAvgFeed(ctx, id, chartPack.PropertyId, start, finish)
			if err != nil {
				return nil, fmt.Errorf("cant get material_value: %w", err)
			}
		default:
			return nil, fmt.Errorf("wrong Scale type: %w", err)
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
		req.Options.XStep = chartPack.XStep
		// for now hard coding it, made more for raw chart gen, here it is usually predefined
		req.Options.TickLimit = 0
		req.Options.NeedLegend = chartPack.NeedLegend
		req.Options.ToFixed = chartPack.ToFixed
		isFirst = false
	}

	bytes, err := s.chart.GetChart(req)
	if err != nil {
		return nil, fmt.Errorf("cant get chart bytes: %w", err)
	}
	return bytes, nil
}

func (s *Service) GetChartRaw(book []byte, tickLimit int) ([]byte, error) {
	req, err := s.ParseBook(book)
	if err != nil {
		return nil, fmt.Errorf("cant parse book: %w", err)
	}
	req.Options.TickLimit = tickLimit
	req.Options.NeedLegend = true

	bytes, err := s.chart.GetChart(req)
	if err != nil {
		return nil, fmt.Errorf("cant get raw chart bytes: %w", err)
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
