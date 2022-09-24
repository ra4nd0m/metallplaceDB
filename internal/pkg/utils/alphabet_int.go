package utils

import (
	"math"
	"strings"
)

func AlphabetToInt(str string) int {
	var num int
	charArr := strings.Split(str, "")
	reverse(charArr)
	pow := 0
	for _, c := range charArr {
		r := []rune(c)
		num += (int(r[0]) - 64) * power(26, pow)
		pow++
	}
	return num
}

func IntToAlphabet(number int32) string {
	var letters string
	number--
	if firstLetter := number / 26; firstLetter > 0 {
		letters += IntToAlphabet(firstLetter)
		letters += string('A' + number%26)
	} else {
		letters += string('A' + number)
	}

	return letters
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
