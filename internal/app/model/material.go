package model

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
