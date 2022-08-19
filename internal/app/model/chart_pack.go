package model

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

const ChartRoutePrefix = "/chart_service/"

type ChartPack struct {
	MaterialIdList []int
	PropertyId     int
	Start          time.Time
	Finish         time.Time
}

func (c ChartPack) ToUrl() string {
	var fn string

	for i := 0; i < len(c.MaterialIdList); i++ {
		fn += strconv.Itoa(c.MaterialIdList[i])
		if i != len(c.MaterialIdList)-1 {
			fn += "-"
		}
	}

	fn += "_" + strconv.Itoa(c.PropertyId)
	fn += "_" + c.Start.Format("2006-01-02") + c.Finish.Format("2006-01-02")

	return ChartRoutePrefix + fn
}

func NewChartPack(url string) (ChartPack, error) {
	fn := strings.TrimLeft(ChartRoutePrefix, url)
	var c ChartPack
	cnt := strings.Split(fn, "_")

	var MaterialIdList []int
	idStrList := strings.Split(cnt[0], "-")
	for _, id := range idStrList {
		idInt, err := strconv.Atoi(id)
		if err != nil {
			return ChartPack{}, fmt.Errorf("cant parse material id: %w", err)
		}
		MaterialIdList = append(MaterialIdList, idInt)
	}

	c.MaterialIdList = MaterialIdList

	propertyId, err := strconv.Atoi(cnt[1])
	if err != nil {
		return ChartPack{}, fmt.Errorf("cant parse property id: %w", err)
	}
	c.PropertyId = propertyId

	start, err := time.Parse("2006-01-02", cnt[2])
	if err != nil {
		return ChartPack{}, fmt.Errorf("cant parse start time: %w", err)
	}
	c.Start = start

	finish, err := time.Parse("2006-01-02", cnt[3])
	if err != nil {
		return ChartPack{}, fmt.Errorf("cant parse finish time: %w", err)
	}
	c.Finish = finish

	return c, nil
}
