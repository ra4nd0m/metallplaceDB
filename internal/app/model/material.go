package model

import "time"

type Property struct {
	Sheet      string
	Name       string
	Column     string
	Row        int
	Kind       string
	DateColumn string
}

// swagger:model Product
type Material struct {
	UId int
	// Name of material
	// in: string
	Name string
	// Group of materials
	// in: string
	Group string
	// Source (website) of materials
	// in: string
	Source string
	// Market (country and ferry) of materials
	// in: string
	Market string
	// DeliveryType INCOTERMS of materials
	// in: string
	DeliveryType string
	// Unit (currency and weight unit) of materials
	// in: string
	Unit string
	// DateColumn column of date sequence in xlsx sheet
	// in: string
	DateColumn string
	// Properties of material
	// in: string
	Properties []Property
}

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
