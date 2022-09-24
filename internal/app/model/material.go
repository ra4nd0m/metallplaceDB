package model

import "time"

type Property struct {
	Name   string
	Column string
	Row    int
	Kind   string
}

type Material struct {
	Sheet      string
	Name       string
	Source     string
	Market     string
	Unit       string
	DateColumn string
	Properties []Property
}

type MaterialHorizontal struct {
	Sheet      string
	Name       string
	Source     string
	Market     string
	Unit       string
	DateRow    string
	Properties []Property
}

type PropertyShortInfo struct {
	Id   int
	Name string
	Kind string
}

type MaterialShortInfo struct {
	Id     int
	Name   string
	Source string
	Market string
	Unit   string
}

type Price struct {
	Date  time.Time `json:"date"`
	Value float64   `json:"value"`
}

type PriceFeed struct {
	Feed []Price
}
