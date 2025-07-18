package service

import (
	"context"
	"fmt"
	"math"
	"metallplace/internal/app/model"
	"time"
)

// GetMonthlyAvgFeed Get calendar month averaged price feed (first day of month as a date)
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
		avgFeed = append(avgFeed, getPriceArrAvg(curFeed, "month"))
		cur = cur.AddDate(0, 1, 0)
	}
	prevPrice := avgFeed[0].Value
	// Cutting out prev price
	avgFeed = avgFeed[1:]
	return avgFeed, prevPrice, nil
}

// GetWeeklyAvgFeed Get calendar week averaged price feed (friday as a date of week)
func (s *Service) GetWeeklyAvgFeed(ctx context.Context, uid, propertyId int, start string, finish string) ([]model.Price, float64, error) {
	layout := "2006-01-02"
	var avgFeed []model.Price

	fmt.Printf("GetWeeklyAvgFeed called with uid=%d, propertyId=%d, start=%s, finish=%s\n",
		uid, propertyId, start, finish)

	cur, err := time.Parse(layout, start)
	if err != nil {
		fmt.Printf("ERROR: Failed to parse start date %s: %v\n", start, err)
		return []model.Price{}, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	cur = cur.AddDate(0, 0, int(-cur.Weekday())-7)

	fin, err := time.Parse(layout, finish)
	if err != nil {
		fmt.Printf("ERROR: Failed to parse finish date %s: %v\n", finish, err)
		return nil, 0, fmt.Errorf("cant parse date in a month: %w", err)
	}
	fin = fin.AddDate(0, 0, int(6-fin.Weekday()))

	fmt.Printf("After adjustment: cur=%s, fin=%s\n", cur.Format(layout), fin.Format(layout))

	for {
		if cur.After(fin) {
			break
		}

		weekStart := cur.Format(layout)
		weekEnd := cur.AddDate(0, 0, 5).Format(layout)
		fmt.Printf("Getting data for week: %s to %s\n", weekStart, weekEnd)

		curFeed, _, err := s.repo.GetMaterialValueForPeriod(ctx, uid, propertyId, weekStart, weekEnd)
		if err != nil {
			fmt.Printf("ERROR: Failed to get feed for uid=%d, propertyId=%d, period %s to %s: %v\n",
				uid, propertyId, weekStart, weekEnd, err)
			return nil, 0, fmt.Errorf("cant get month feed: %w", err)
		}

		fmt.Printf("Retrieved %d records for week %s to %s\n", len(curFeed), weekStart, weekEnd)

		if len(curFeed) == 0 {
			fmt.Printf("WARNING: Empty feed for uid=%d, propertyId=%d, period %s to %s\n",
				uid, propertyId, weekStart, weekEnd)
			// Skip this week as we have no data
			cur = cur.AddDate(0, 0, 7)
			continue
		}

		avgFeed = append(avgFeed, getPriceArrAvg(curFeed, "week"))
		cur = cur.AddDate(0, 0, 7)
	}

	if len(avgFeed) == 0 {
		fmt.Printf("ERROR: No data found for the entire period for uid=%d, propertyId=%d, start=%s, finish=%s\n",
			uid, propertyId, start, finish)
		return []model.Price{}, 0, fmt.Errorf("no data found for the period")
	}

	prevPrice := avgFeed[0].Value
	// Cutting out prev price
	avgFeed = avgFeed[1:]
	return avgFeed, prevPrice, nil
}

func getPriceArrAvg(feed []model.Price, period string) model.Price {
	if len(feed) == 0 {
		fmt.Println("WARNING: getPriceArrAvg called with empty feed")
		// Return a zero value with current date as fallback
		return model.Price{Date: time.Now(), Value: 0}
	}

	var sum float64
	for _, p := range feed {
		sum += p.Value
	}

	var date time.Time
	if period == "week" {
		date = getMondayOfWeek(feed[0].Date)
	} else {
		date = time.Date(feed[0].Date.Year(), feed[0].Date.Month(), 1, 0, 0, 0, 0, time.Local)
	}

	return model.Price{Date: date, Value: math.Round(sum/float64(len(feed))*1000) / 1000}
}

func getMondayOfWeek(date time.Time) time.Time {
	weekday := date.Weekday()
	daysAgo := int(weekday - time.Monday)
	if daysAgo < 0 {
		daysAgo += 7
	}
	monday := date.AddDate(0, 0, -daysAgo)
	return monday
}
