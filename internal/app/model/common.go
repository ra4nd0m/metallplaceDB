package model

import "time"

// Property example
type Property struct {
	Sheet      string `example:"01. ЖРС"`
	Name       string `example:"ЖРС 65%"`
	Column     string `example:"C"`
	Row        int    `example:"34" format:"int64"`
	Kind       string `example:"decimal"`
	DateColumn string `example:"A"`
}

// Material example
type Material struct {
	UId          int
	Name         string
	Group        string
	Source       string
	Market       string
	DeliveryType string
	Unit         string
	DateColumn   string
	Properties   []Property
}

// DailyMaterial example
type DailyMaterial struct {
	UId          int
	Name         string
	Group        string
	Source       string
	Market       string
	DeliveryType string
	Unit         string
	DateColumn   string
	Properties   []Property
	NeedSplit    bool
	ConvSettings ConvSettings
}

type ConvSettings struct {
	Need bool
	Func func(float64, float64) float64
	Rate float64
}
type MaterialHorizontal struct {
	UId          int
	Name         string
	Group        string
	Source       string
	Market       string
	DeliveryType string
	Unit         string
	DateRow      string
	Properties   []Property
}

type PropertyShortInfo struct {
	Id   int    `example:"2" format:"int64"`
	Name string `example:"Средняя цена" format:"string"`
	Kind string `example:"decimal" format:"string"`
}

// MaterialShortInfo example
type MaterialShortInfo struct {
	Id           int    `example:"2" format:"int64"`
	Name         string `example:"ЖРС 65%" format:"string"`
	Group        string `example:"Сырьевые материалы" format:"string"`
	Source       string `example:"metallplace.ru" format:"string"`
	Market       string `example:"Россия" format:"string"`
	DeliveryType string `example:"FOB" format:"string"`
	Unit         string `example:"$/т" format:"string"`
}

// ChangeSummary example
type ChangeSummary struct {
	MaterialName          string  `json:"material_name" example:"Лом 3А"`
	DeliveryType          string  `json:"delivery_type" example:"FOB"`
	Market                string  `json:"market" example:"Урал (Россия)"`
	CurrentPrice          float64 `json:"current_price" example:"17500"`
	Unit                  string  `json:"unit" example:"₽/т"`
	DailyChanges          float64 `json:"daily_changes" example:"-300"`
	DailyChangesPercent   float64 `json:"daily_changes_percent" example:"-5"`
	WeeklyChanges         float64 `json:"weekly_changes" example:"100"`
	WeeklyChangesPercent  float64 `json:"weekly_changes_percent" example:"2"`
	MonthlyChanges        float64 `json:"monthly_changes" example:"-100"`
	MonthlyChangesPercent float64 `json:"monthly_changes_percent" example:"-3.85"`
}

// Price example
type Price struct {
	Date  time.Time `json:"date" example:"2022-03-23" format:"string"`
	Value float64   `json:"value" example:"12.97" format:"float64"`
}

type PriceFeed struct {
	Feed []Price
}

// UnitInfo example
type UnitInfo struct {
	Id   int    `json:"id" example:"2" format:"int64"`
	Name string `json:"name" example:"$/t" format:"string"`
}

// DeliveryTypeInfo example
type DeliveryTypeInfo struct {
	Id   int    `json:"id" example:"4" format:"int64"`
	Name string `json:"name" example:"FOB" format:"string"`
}
