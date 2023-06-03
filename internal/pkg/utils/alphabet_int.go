package utils

import (
	"errors"
	"math"
	"strings"
)

var ErrEmptyString = errors.New("empty string")
var ErrWrongNumber = errors.New("wrong number")

func AlphabetToInt(str string) (int, error) {
	if len(str) == 0 {
		return 0, ErrEmptyString
	}

	var num int
	charArr := strings.Split(str, "")
	reverse(charArr)
	pow := 0
	for _, c := range charArr {
		r := []rune(c)
		num += (int(r[0]) - 64) * power(26, pow)
		pow++
	}
	return num, nil
}

func IntToAlphabet(number int32) (string, error) {
	if number <= 0 {
		return "", ErrWrongNumber
	}
	var letters string
	number--
	if firstLetter := number / 26; firstLetter > 0 {
		num, err := IntToAlphabet(firstLetter)
		if err != nil {
			return "", err
		}
		letters += num
		letters += string('A' + number%26)
	} else {
		letters += string('A' + number)
	}

	return letters, nil
}

func reverse(ss []string) {
	last := len(ss) - 1
	for i := 0; i < len(ss)/2; i++ {
		ss[i], ss[last-i] = ss[last-i], ss[i]
	}
}

func power(n, m int) int {
	return int(math.Pow(float64(n), float64(m)))
}
