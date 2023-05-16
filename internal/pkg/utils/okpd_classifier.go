package utils

import (
	"fmt"
	"strconv"
)

func OkpdUnitClassifier(codeStr string) (string, float64, error) {
	code, err := strconv.Atoi(codeStr)
	if err != nil {
		return "", 0, fmt.Errorf("cannot convert unit ОКПД id to int: %w", err)
	}
	switch code {
	case 168:
		return "", 1, nil
	case 169:
		return "тонна", 1000, nil
	default:
		return "", 0, fmt.Errorf("unknown ОКПД unit id: %w", code)
	}
}
