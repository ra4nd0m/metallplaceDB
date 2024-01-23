package service

import "testing"

func TestFormatMonth(t *testing.T) {
	tests := []struct {
		name     string
		arg      string
		expected string
	}{
		{
			"Short eng with year",
			"Dec-22",
			"Дек-22",
		},
		{
			"Rome with year",
			"XI-22",
			"Ноя-22",
		},
		{
			"Short ru without year",
			"апр",
			"Апр",
		},
		{
			"Full ru with year",
			"Сентябрь-21",
			"Сен-21",
		},
		{
			"Wrong month",
			"Abc-21",
			"undefined",
		},
	}

	for _, test := range tests {
		if res := formatMonth(test.arg); res == test.expected {
			t.Logf(`Test "%s" succeed. Extected (%s), got (%s)`, test.name, test.expected, res)
		} else {
			t.Errorf(`Test "%s" FAILED. Extected (%s), got (%s)`, test.name, test.expected, res)
		}
	}
}
