package service

import (
	"context"
	"fmt"
	"math"
	"metallplace/internal/app/model"
	"time"
)

func (s *Service) GetSummary(ctx context.Context, materialId int, propertyId int, date string) (model.ChangeSummary, error) {
	layout := "2006-01-02"
	d, err := time.Parse(layout, date)
	if err != nil {
		return model.ChangeSummary{}, fmt.Errorf("cant parce date: %w", err)
	}

	materialInfo, err := s.GetMaterialSourceInfo(ctx, materialId)
	if err != nil {
		return model.ChangeSummary{}, fmt.Errorf("cant get material source info while getting change summary: %w", err)
	}
	summary := model.ChangeSummary{
		MaterialName: materialInfo.Name,
		DeliveryType: materialInfo.DeliveryType,
		Market:       materialInfo.Market,
		Unit:         materialInfo.Unit,
	}

	currentDayFeed, _, err := s.GetMaterialValueForPeriod(ctx, materialId, propertyId,
		d.AddDate(0, 0, -14).Format(layout),
		date,
	)
	if err != nil {
		return model.ChangeSummary{}, fmt.Errorf("cant get curret price: %w", err)
	}
	if len(currentDayFeed) < 2 {
		return model.ChangeSummary{}, fmt.Errorf("empty current or prev price")
	}
	currentPrice := currentDayFeed[len(currentDayFeed)-1].Value
	prevPrice := currentDayFeed[len(currentDayFeed)-2].Value
	summary.CurrentPrice = currentPrice
	summary.DailyChanges = math.Round((currentPrice-prevPrice)*100) / 100
	summary.DailyChangesPercent = (currentPrice/prevPrice)*100 - 100
	summary.DailyChangesPercent = math.Round(summary.DailyChangesPercent*100) / 100

	weekAgoFeed, _, err := s.GetMaterialValueForPeriod(ctx, materialId, propertyId,
		d.AddDate(0, 0, -7*2).Format(layout),
		d.AddDate(0, 0, -7).Format(layout),
	)
	if err != nil {
		return model.ChangeSummary{}, fmt.Errorf("cant get week ago price: %w", err)
	}
	if len(weekAgoFeed) == 0 {
		return model.ChangeSummary{}, fmt.Errorf("empty week ago price")
	}
	weekAgoPrice := weekAgoFeed[len(weekAgoFeed)-1].Value
	summary.WeeklyChanges = math.Round((currentPrice-weekAgoPrice)*100) / 100
	summary.WeeklyChangesPercent = (currentPrice/weekAgoPrice)*100 - 100
	summary.WeeklyChangesPercent = math.Round(summary.WeeklyChangesPercent*100) / 100

	monthAgoFeed, _, err := s.GetMaterialValueForPeriod(ctx, materialId, propertyId,
		GetDateFiveWeeksAgo(d).AddDate(0, 0, -10).Format(layout),
		GetDateFiveWeeksAgo(d).Format(layout),
	)
	if err != nil {
		return model.ChangeSummary{}, fmt.Errorf("cant get month ago price: %w", err)
	}
	if len(monthAgoFeed) == 0 {
		return model.ChangeSummary{}, fmt.Errorf("empty month ago price")
	}
	monthAgoPrice := monthAgoFeed[len(monthAgoFeed)-1].Value
	summary.MonthlyChanges = math.Round((currentPrice-monthAgoPrice)*100) / 100
	summary.MonthlyChangesPercent = (currentPrice/monthAgoPrice)*100 - 100
	summary.MonthlyChangesPercent = math.Round(summary.MonthlyChangesPercent*100) / 100

	return summary, nil
}
