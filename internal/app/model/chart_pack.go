package model

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

const ChartRoutePostfix = ".png"

type ChartPack struct {
	MaterialIdList []int
	PropertyId     int
	Start          time.Time
	Finish         time.Time
	NeedLabels     bool   // labels with prise near points on chart
	Type           string // line or bar chart
	Scale          string //averaging values day, month or week
	XStep          string // what we write on X axis - date, week number or month
	NeedLegend     bool   // is legend needed on chart image
	ToFixed        int    // getting to fixed amount of numbers after dot, in other words rounding
	Predict        bool   // do we need predict values on chart
	Tall           bool   // can manipulate chart resolution
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
	needLabels := "0"
	needLegend := "0"
	needPredict := "0"
	tall := "0"
	if c.NeedLabels {
		needLabels = "1"
	}
	if c.NeedLegend {
		needLegend = "1"
	}
	if c.Predict {
		needPredict = "1"
	}
	if c.Tall {
		tall = "1"
	}

	fn += "_" + needLabels
	fn += "_" + c.Type
	fn += "_" + c.Scale
	fn += "_" + c.XStep
	fn += "_" + needLegend
	fn += "_" + strconv.Itoa(c.ToFixed)
	fn += "_" + needPredict
	fn += "_" + tall

	return fn + ChartRoutePostfix
}

func NewChartPack(url string) (ChartPack, error) {
	fn := strings.TrimRight(url, ChartRoutePostfix)
	var c ChartPack
	cnt := strings.Split(fn, "_")
	if len(cnt) < 11 {
		return ChartPack{}, errors.New("chart's url config too short")
	}

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

	start, err := time.Parse("01-02-2006", cnt[2])
	if err != nil {
		return ChartPack{}, fmt.Errorf("cant parse start time: %w", err)
	}
	c.Start = start

	finish, err := time.Parse("01-02-2006", cnt[3])
	if err != nil {
		return ChartPack{}, fmt.Errorf("cant parse finish time: %w", err)
	}
	c.Finish = finish

	if cnt[4] == "1" {
		c.NeedLabels = true
	}

	c.Type = cnt[5]

	c.Scale = cnt[6]

	c.XStep = cnt[7]

	if cnt[8] == "1" {
		c.NeedLegend = true
	}

	toFixed, err := strconv.Atoi(cnt[9])
	if err != nil {
		return ChartPack{}, fmt.Errorf("cant parse ToFixed: %w", err)
	}
	c.ToFixed = toFixed

	if cnt[10] == "1" {
		c.Predict = true
	}

	if cnt[11] == "1" {
		c.Tall = true
	}
	return c, nil
}
