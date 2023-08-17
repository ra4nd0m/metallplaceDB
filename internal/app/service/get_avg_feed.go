package service

import (
	"context"
	"fmt"
	"math"
	"metallplace/internal/app/model"
	"time"
)

func (s *Service) GetMonthlyAvgFeed(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	layout := "2006-01-02"
	var avgFeed []model.Price
	cur, err := time.Parse(layout, start)
	if err != nil {
		return []model.Price{}, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	year := cur.Year()
	month := cur.Month() - 1
	if month == 0 {
		year--
		month = 12
	}
	cur = time.Date(year, month, 1, 0, 0, 0, 0, cur.Location())

	fin, err := time.Parse(layout, finish)
	if err != nil {
		return nil, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	fin = time.Date(fin.Year(), fin.Month(), 1, 0, 0, 0, 0, fin.Location())

	for {
		if cur.After(fin) {
			break
		}
		curFeed, _, err := s.repo.GetMaterialValueForPeriod(ctx, uid, propertyId, cur.Format(layout), cur.AddDate(0, 1, -1).Format(layout))
		if err != nil {
			return nil, 0, fmt.Errorf("cant get month feed: %w", err)
		}
		avgFeed = append(avgFeed, getPriceArrAvg(curFeed))
		cur = cur.AddDate(0, 1, 0)
	}
	prevPrice := avgFeed[0].Value
	avgFeed = avgFeed[1:]
	return avgFeed, prevPrice, nil
}

func (s *Service) GetWeeklyAvgFeed(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	layout := "2006-01-02"
	var avgFeed []model.Price

	cur, err := time.Parse(layout, start)
	if err != nil {
		return []model.Price{}, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	cur = cur.AddDate(0, 0, int(-cur.Weekday())-7)

	fin, err := time.Parse(layout, finish)
	if err != nil {
		return nil, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	fin = fin.AddDate(0, 0, int(6-fin.Weekday()))

	for {
		if cur.After(fin) {
			break
		}
		curFeed, _, err := s.repo.GetMaterialValueForPeriod(ctx, uid, propertyId, cur.Format(layout), cur.AddDate(0, 0, 5).Format(layout))
		if err != nil {
			return nil, 0, fmt.Errorf("cant get month feed: %w", err)
		}
		avgFeed = append(avgFeed, getPriceArrAvg(curFeed))
		cur = cur.AddDate(0, 0, 7)
	}
	prevPrice := avgFeed[0].Value
	avgFeed = avgFeed[1:]
	return avgFeed, prevPrice, nil
}

func getPriceArrAvg(feed []model.Price) model.Price {
	var sum float64
	for _, p := range feed {
		sum += p.Value
	}
	date := time.Date(feed[0].Date.Year(), feed[0].Date.Month(), 1, 0, 0, 0, 0, time.Local)
	return model.Price{Date: date, Value: math.Round(sum/float64(len(feed))*100) / 100}
}
