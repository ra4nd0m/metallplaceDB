package service

import (
	"context"
	"fmt"
	"math"
	"metallplace/internal/app/model"
	"time"
)

func (s *Service) GetMonthlyAvgFeed(ctx context.Context, materialSourceId, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	layout := "2006-01-02"
	var avgFeed []model.Price
	cur, err := time.Parse(layout, start)
	if err != nil {
		return []model.Price{}, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	fin, err := time.Parse(layout, finish)
	if err != nil {
		return nil, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}

	for {
		if cur.After(fin) {
			break
		}
		curFeed, _, err := s.repo.GetMaterialValueForPeriod(ctx, materialSourceId, propertyId, cur.Format(layout), cur.AddDate(0, 1, 0).Format(layout))
		if err != nil {
			return nil, 0, fmt.Errorf("cant get month feed: %w", err)
		}
		avgFeed = append(avgFeed, getPriceArrAvg(curFeed))
		cur = cur.AddDate(0, 1, 0)
	}
	return avgFeed, 0, nil
}

func getPriceArrAvg(feed []model.Price) model.Price {
	var sum float64
	for _, p := range feed {
		sum += p.Value
	}
	return model.Price{Date: feed[0].Date, Value: math.Round(sum/float64(len(feed))*100) / 100}
}
