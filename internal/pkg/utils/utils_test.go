package utils

import "testing"

func TestAlphabetToInt(t *testing.T) {
	tests := []struct {
		name string
		arg  string
		res  int
		err  error
	}{
		{
			"correct",
			"A",
			1,
			nil,
		},
		{
			"empty_string",
			"",
			0,
			ErrEmptyString,
		},
		{
			"correct_two_symbols",
			"AA",
			27,
			nil,
		},
	}

	for _, test := range tests {
		if res, err := AlphabetToInt(test.arg); res == test.res && err == test.err {
			t.Logf(`Test "%s" succeed. Extected (%d, %v), got (%d, %v)`, test.name, test.res, test.err, res, err)
		} else {
			t.Errorf(`Test "%s" FAILED. Extected (%d, %v), got (%d, %v)`, test.name, test.res, test.err, res, err)
		}
	}
}

func TestIntToAlphabet(t *testing.T) {
	tests := []struct {
		name string
		arg  int32
		res  string
		err  error
	}{
		{
			"zero_arg",
			0,
			"",
			ErrWrongNumber,
		},
		{
			"negative_arg",
			-3,
			"",
			ErrWrongNumber,
		},
		{
			"valid_arg",
			27,
			"AA",
			nil,
		},
	}
	for _, test := range tests {
		if res, err := IntToAlphabet(test.arg); res == test.res && err == test.err {
			t.Logf(`Test "%s" succeed. Extected (%s, %v), got (%s, %v)`, test.name, test.res, test.err, res, err)
		} else {
			t.Errorf(`Test "%s" FAILED. Extected (%s, %v), got (%s, %v)`, test.name, test.res, test.err, res, err)
		}
	}
}
