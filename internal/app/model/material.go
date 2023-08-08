package model

import "time"

type Property struct {
	Sheet  string
	Name   string
	Column string
	Row    int
	Kind   string
}

type Material struct {
	Name         string
	Group        string
	Source       string
	Market       string
	DeliveryType string
	Unit         string
	DateColumn   string
	Properties   []Property
}

type DailyMaterial struct {
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
	Id   int
	Name string
	Kind string
}

type MaterialShortInfo struct {
	Id           int
	Name         string
	Group        string
	Source       string
	Market       string
	DeliveryType string
	Unit         string
}

type Price struct {
	Date  time.Time `json:"date"`
	Value float64   `json:"value"`
}

type PriceFeed struct {
	Feed []Price
}
