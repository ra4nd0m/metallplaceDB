package service

import (
	"bytes"
	"context"
	"fmt"
	"github.com/xuri/excelize/v2"
	"math"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/utils"
	"metallplace/pkg/chartclient"
	db "metallplace/pkg/gopkg-db"
	"strconv"
	"strings"
	"time"
)

// InitialImport Importing data from book, using layout written by hand
func (s *Service) InitialImport(ctx context.Context) error {
	dateLayout := "2-Jan-06"

	book, err := excelize.OpenFile("var/analytics.xlsx")
	if err != nil {
		return fmt.Errorf("cannot open exel file %w", err)
	}

	err = db.ExecTx(ctx, func(ctx context.Context) error {

		for _, material := range model.InitMaterialsVertical {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
			if err != nil {
				return err
			}

			fmt.Println("Adding material " + material.Name)

			// Adding and tying properties
			for _, property := range material.Properties {
				propertyId, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Name: property.Name, Kind: property.Kind})
				if err != nil {
					return err
				}

				err = s.repo.AddMaterialProperty(ctx, materialSourceId, propertyId)
			}

			// Going through material's properties, and reading property values
			for _, property := range material.Properties {
				fmt.Println(property.Name)
				row := property.Row
				for {
					var value string
					valueCellValue, err := book.GetCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}
					valueCalc, err := book.CalcCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}

					if valueCellValue == "" && valueCalc == "" {
						break
					} else if valueCellValue != "" {
						value = valueCellValue
					} else if valueCalc != "" {
						value = valueCalc
					} else {
						value = "1000000000"
					}

					// Calculating date cell, and formatting it
					dateCell := material.DateColumn + strconv.Itoa(row)
					style, _ := book.NewStyle(`{"number_format":15}`)
					book.SetCellStyle(material.Sheet, dateCell, dateCell, style)

					dateStr, err := book.GetCellValue(material.Sheet, dateCell)
					if err != nil {
						return err
					}
					dateType, err := book.GetCellType(material.Sheet, dateCell)
					if err != nil {
						return err
					}

					// Parsing date
					createdOn, err := time.Parse(dateLayout, dateStr)
					if err != nil {
						return fmt.Errorf("Can't parce date [%v,%v] '%v' (%v): %w", material.Sheet, dateCell, dateStr, dateType, err)
					}

					// Checking type of value: string or decimal
					var valueStr string
					var valueDecimal float64
					if property.Kind == "decimal" {
						valueDecimal, err = strconv.ParseFloat(value, 64)
						if err != nil {
							return err
						}
					} else {
						valueStr = value
					}

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
					if err != nil {
						return fmt.Errorf("cann not get material source id: %v", err)
					}

					err = s.repo.AddMaterialValue(ctx, materialSourceId, property.Name, valueDecimal, valueStr, createdOn)
					if err != nil {
						return err
					}

					row++
					if row%100 == 0 {
						fmt.Print("#")
					}
				}
				fmt.Println("")
			}
		}
		for _, material := range model.InitMaterialsHorizontalWeekly {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
			if err != nil {
				return fmt.Errorf("cant add unique material %v: %w", material.Name, err)
			}

			fmt.Println("Adding material " + material.Name)

			// Adding and tying properties
			for _, property := range material.Properties {
				propertyId, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Name: property.Name, Kind: property.Kind})
				if err != nil {
					return fmt.Errorf("cant add/get property %v: %w", property.Name, err)
				}

				err = s.repo.AddMaterialProperty(ctx, materialSourceId, propertyId)
				if err != nil {
					return fmt.Errorf("cant add material_property %v-%v: %w", material.Name, property.Name, err)
				}
			}
			for _, property := range material.Properties {
				fmt.Println(property.Name)
				col := utils.AlphabetToInt(property.Column)
				for {
					value, err := book.CalcCellValue(material.Sheet, utils.IntToAlphabet(int32(col))+strconv.Itoa(property.Row))
					if err != nil {
						return fmt.Errorf("cant calc cell %s %s%d value: %w", material.Sheet, property.Column, property.Row, err)
					}

					if value == "" {
						value, err = book.GetCellValue(material.Sheet, utils.IntToAlphabet(int32(col))+strconv.Itoa(property.Row))
						if err != nil {
							return fmt.Errorf("cant get cell value: %w", err)
						}
						if value == "" {
							break
						}
					}
					dateCell := utils.IntToAlphabet(int32(col)) + material.DateRow
					dateStr, err := book.GetCellValue(material.Sheet, dateCell)
					if err != nil {
						return fmt.Errorf("cant get cell value: %w", err)
					}
					createdOn, err := stringToDate(dateStr, "week")
					if err != nil {
						return fmt.Errorf("Can't parce date [%v,%v]: %w", material.Sheet, dateCell, err)
					}

					// Checking type of value: string or decimal
					var valueStr string
					var valueDecimal float64
					if property.Kind == "decimal" {
						valueDecimal, err = strconv.ParseFloat(value, 64)
						valueDecimal = math.Round(valueDecimal)
						if err != nil {
							return err
						}
					} else {
						valueStr = value
					}

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
					if err != nil {
						return fmt.Errorf("cann not get material source id: %v", err)
					}

					err = s.repo.AddMaterialValue(ctx, materialSourceId, property.Name, valueDecimal, valueStr, createdOn)
					if err != nil {
						return err
					}

					if col >= utils.AlphabetToInt("GX") {
						col += 5
					} else {
						col += 4
					}

					if col%100 == 0 {
						fmt.Print("#")
					}
				}
			}
		}
		for _, material := range model.InitMaterialsHorizontalMonthly {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
			if err != nil {
				return fmt.Errorf("cant add unique material %v: %w", material.Name, err)
			}

			fmt.Println("Adding material " + material.Name)

			// Adding and tying properties
			for _, property := range material.Properties {
				propertyId, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Name: property.Name, Kind: property.Kind})
				if err != nil {
					return fmt.Errorf("cant add/get property %v: %w", property.Name, err)
				}

				err = s.repo.AddMaterialProperty(ctx, materialSourceId, propertyId)
				if err != nil {
					return fmt.Errorf("cant add material_property %v-%v: %w", material.Name, property.Name, err)
				}
			}
			for _, property := range material.Properties {
				fmt.Println(property.Name)
				col := utils.AlphabetToInt(property.Column)
				for {

					value, err := book.CalcCellValue(material.Sheet, utils.IntToAlphabet(int32(col))+strconv.Itoa(property.Row))
					if err != nil {
						return fmt.Errorf("cant get cell value: %w", err)
					}

					if value == "" {
						value, err = book.GetCellValue(material.Sheet, utils.IntToAlphabet(int32(col))+strconv.Itoa(property.Row))
						if value == "" {
							break
						}
					}
					dateCell := utils.IntToAlphabet(int32(col)) + material.DateRow
					dateStr, err := book.GetCellValue(material.Sheet, dateCell)
					if err != nil {
						return fmt.Errorf("cant get cell value: %w", err)
					}
					createdOn, err := stringToDate(dateStr, "month")
					if err != nil {
						return fmt.Errorf("Can't parce date [%v,%v]: %w", material.Sheet, dateCell, err)
					}

					// Checking type of value: string or decimal
					var valueStr string
					var valueDecimal float64
					if property.Kind == "decimal" {
						valueDecimal, err = strconv.ParseFloat(value, 64)
						valueDecimal = math.Round(valueDecimal)
						if err != nil {
							return err
						}
					} else {
						valueStr = value
					}

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
					if err != nil {
						return fmt.Errorf("cann not get material source id: %v", err)
					}

					err = s.repo.AddMaterialValue(ctx, materialSourceId, property.Name, valueDecimal, valueStr, createdOn)
					if err != nil {
						return err
					}

					if col >= utils.AlphabetToInt("I") {
						col += 5
					} else {
						col += 4
					}

					if col%100 == 0 {
						fmt.Print("#")
					}
				}
			}

		}

		for _, material := range model.InitMonthPredict {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
			if err != nil {
				return err
			}

			fmt.Println("Adding material " + material.Name)

			// Adding and tying properties
			for _, property := range material.Properties {
				propertyId, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Name: property.Name, Kind: property.Kind})
				if err != nil {
					return err
				}

				err = s.repo.AddMaterialProperty(ctx, materialSourceId, propertyId)
			}

			// Going through material's properties, and reading property values
			for _, property := range material.Properties {
				fmt.Println(property.Name)
				row := property.Row
				for {
					var value string
					valueCellValue, err := book.GetCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}
					valueCalc, err := book.CalcCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}

					if valueCellValue == "" && valueCalc == "" {
						break
					} else if valueCellValue != "" {
						value = valueCellValue
					} else if valueCalc != "" {
						value = valueCalc
					} else {
						value = "1000000000"
					}

					// Calculating date cell, and formatting it
					dateCell := material.DateColumn + strconv.Itoa(row)

					dateStr, err := book.GetCellValue(material.Sheet, dateCell)
					if err != nil {
						return err
					}

					// Parsing date
					createdOn, err := getMonthDateForPredict(dateStr)
					if err != nil {
						return fmt.Errorf("can't parce date [%v,%v] '%v' : %w", material.Sheet, dateCell, dateStr, err)
					}

					// Checking type of value: string or decimal
					var valueStr string
					var valueDecimal float64
					if property.Kind == "decimal" {
						valueDecimal, err = strconv.ParseFloat(value, 64)
						if err != nil {
							return err
						}
					} else {
						valueStr = value
					}

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
					if err != nil {
						return fmt.Errorf("cann not get material source id: %v", err)
					}

					err = s.repo.AddMaterialValue(ctx, materialSourceId, property.Name, valueDecimal, valueStr, createdOn)
					if err != nil {
						return err
					}

					row++
					if row%100 == 0 {
						fmt.Print("#")
					}
				}
				fmt.Println("")
			}
		}
		for _, material := range model.InitWeekPredict {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
			if err != nil {
				return err
			}

			fmt.Println("Adding material " + material.Name)

			// Adding and tying properties
			for _, property := range material.Properties {
				propertyId, err := s.repo.AddPropertyIfNotExists(ctx, model.PropertyShortInfo{Name: property.Name, Kind: property.Kind})
				if err != nil {
					return err
				}

				err = s.repo.AddMaterialProperty(ctx, materialSourceId, propertyId)
			}

			// Going through material's properties, and reading property values
			for _, property := range material.Properties {
				fmt.Println(property.Name)
				row := property.Row
				for {
					var value string
					valueCellValue, err := book.GetCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}
					valueCalc, err := book.CalcCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}

					if valueCellValue == "" && valueCalc == "" {
						break
					} else if valueCellValue != "" {
						value = valueCellValue
					} else if valueCalc != "" {
						value = valueCalc
					} else {
						value = "1000000000"
					}

					// Calculating date cell, and formatting it
					dateCell := material.DateColumn + strconv.Itoa(row)

					dateStr, err := book.GetCellValue(material.Sheet, dateCell)
					if err != nil {
						return err
					}

					// Parsing date
					createdOn, err := stringToDate(dateStr, "weekNum")
					if err != nil {
						return fmt.Errorf("can't parce date [%v,%v] '%v' : %w", material.Sheet, dateCell, dateStr, err)
					}

					// Checking type of value: string or decimal
					var valueStr string
					var valueDecimal float64
					if property.Kind == "decimal" {
						valueDecimal, err = strconv.ParseFloat(value, 64)
						if err != nil {
							return err
						}
					} else {
						valueStr = value
					}

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit, material.DeliveryType)
					if err != nil {
						return fmt.Errorf("cann not get material source id: %v", err)
					}

					err = s.repo.AddMaterialValue(ctx, materialSourceId, property.Name, valueDecimal, valueStr, createdOn)
					if err != nil {
						return err
					}

					row++
					if row%100 == 0 {
						fmt.Print("#")
					}
				}
				fmt.Println("")
			}
		}
		return nil
	})
	if err != nil {
		return fmt.Errorf("cant exec init import tx: %w", err)
	}

	fmt.Print("Import finished!")
	return nil
}

func (s *Service) ParseBook(byte []byte) (chartclient.Request, error) {
	reader := bytes.NewReader(byte)
	book, err := excelize.OpenReader(reader)
	if err != nil {
		return chartclient.Request{}, fmt.Errorf("cannot open exel file %w", err)
	}
	labelColumn := "A"
	materialStartColumn := "B"
	startRow := 2
	startSheet := "Лист1"
	var req chartclient.Request

	for curCol := utils.AlphabetToInt(materialStartColumn); true; curCol++ {
		var valueFloat float64
		curRow := startRow
		var curDate string
		var materialAndPrices chartclient.YDataSet
		// Reading material name
		value, err := book.GetCellValue(startSheet, utils.IntToAlphabet(int32(curCol))+strconv.Itoa(startRow))
		if err != nil {
			return chartclient.Request{}, fmt.Errorf("cant get cell value: %w", err)
		}
		if value == "" {
			break
		}
		materialAndPrices.Label = value
		wereAnyValues := false

		for row := curRow + 1; true; row++ {
			// Reading prices
			value, err = book.GetCellValue(startSheet, utils.IntToAlphabet(int32(curCol))+strconv.Itoa(row))
			if err != nil {
				return chartclient.Request{}, fmt.Errorf("cant get cell value col %d, row %d: %w", row, curCol, err)
			}
			if value == "" {
				isBreak, err := areNextCellsEmpty(book, startSheet, curCol, row, 10)
				if err != nil {
					return chartclient.Request{}, fmt.Errorf("cant check next n values: %w", err)
				}
				if isBreak {
					break
				}
				if !wereAnyValues {
					valueFloat = -1
				}
			} else {
				wereAnyValues = true
				valueFloat, err = strconv.ParseFloat(value, 64)
				if err != nil {
					return chartclient.Request{}, fmt.Errorf("cant convert string to float: %w", err)
				}
			}
			materialAndPrices.Data = append(materialAndPrices.Data, math.Round(valueFloat*100)/100)

			// Reading labels
			if curCol == utils.AlphabetToInt(materialStartColumn) {
				value, err = book.GetCellValue(startSheet, labelColumn+strconv.Itoa(row))
				if err != nil {
					return chartclient.Request{}, fmt.Errorf("cant get cell value: %w", err)
				}
				if value != "" {
					curDate = value
				}
				curLabel := formatMonth(curDate)
				// making repeating labels an empty string
				if len(req.XLabelSet) > 0 && curLabel == getLastNotEmptyElement(req.XLabelSet) {
					curLabel = ""
				}
				req.XLabelSet = append(req.XLabelSet, curLabel)
			}
		}
		req.YDataSet = append(req.YDataSet, materialAndPrices)
	}
	title, err := book.GetCellValue(startSheet, "A1")
	if err != nil {
		return chartclient.Request{}, fmt.Errorf("cant get chart title: %w", err)
	}
	req.Options.Title = title
	return req, nil
}
func getMonthDateForPredict(month string) (time.Time, error) {
	monthsMap := map[string]string{
		"Янв": "Jan",
		"Фев": "Feb",
		"Мар": "Mar",
		"Апр": "Apr",

		"Май": "May",
		"Июн": "Jun",
		"Июл": "Jul",
		"Авг": "Aug",
		"Сен": "Sep",
		"Окт": "Oct",
		"Ноя": "Nov",
		"Дек": "Dec",
	}
	format := "Jan'06"
	arr := strings.Split(month, "'")
	monthInEnglish := monthsMap[arr[0]]
	if monthInEnglish == "" {
		return time.Time{}, fmt.Errorf("error: Unrecognized month")
	}
	t, err := time.Parse(format, monthInEnglish+"'"+arr[1])
	if err != nil {
		return time.Time{}, fmt.Errorf("Error parsing date: %w", err)
	}
	return t, nil
}

func getLastNotEmptyElement(slice []string) string {
	lastElement := ""
	for i := len(slice) - 1; i >= 0; i-- {
		if slice[i] != "" {
			lastElement = slice[i]
			break
		}
	}
	return lastElement
}

func areNextCellsEmpty(book *excelize.File, sheet string, col int, row int, n int) (bool, error) {
	for i := row; i < row+n; i++ {
		value, err := book.GetCellValue(sheet, utils.IntToAlphabet(int32(col))+strconv.Itoa(i))
		if err != nil {
			return false, fmt.Errorf("cant get cell value in areNextCellsEmpty: %w", err)
		}
		if value != "" {
			return false, nil
		}
	}
	return true, nil
}

func stringToDate(str string, style string) (time.Time, error) {
	if style == "week" {
		arr := strings.Split(str, " ")
		week, err := strconv.Atoi(arr[0])
		if err != nil {
			return time.Time{}, fmt.Errorf("cant parce week (%v): %w", arr[0], err)
		}
		year, err := strconv.Atoi(arr[2])
		if err != nil {
			return time.Time{}, fmt.Errorf("cant parce year: %w", err)
		}
		mon := firstDayOfISOWeek(year, week)
		return mon, nil
	}
	if style == "weekNum" {
		arr := strings.Split(str, " ")
		week, err := strconv.Atoi(arr[0])
		if err != nil {
			return time.Time{}, fmt.Errorf("cant parce week (%v): %w", arr[0], err)
		}
		yearStr := arr[1]
		yearStr = yearStr[1 : len(yearStr)-1]
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			return time.Time{}, fmt.Errorf("cant parce year: %w", err)
		}
		mon := firstDayOfISOWeek(year, week)
		return mon, nil
	}
	if style == "month" {
		arr := strings.Split(str, " ")
		monthStr := arr[0]
		month, err := monthStrToNumber(monthStr)
		if err != nil {
			return time.Time{}, fmt.Errorf("cant parce month: %w", err)
		}
		year, err := strconv.Atoi(arr[1])
		if err != nil {
			return time.Time{}, fmt.Errorf("cant parce year: %w", err)
		}
		return time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC), nil
	}
	return time.Time{}, fmt.Errorf("wrong style")

}

func firstDayOfISOWeek(year int, week int) time.Time {
	date := time.Date(year, 0, 0, 0, 0, 0, 0, time.UTC)
	isoYear, isoWeek := date.ISOWeek()
	for date.Weekday() != time.Monday { // iterate back to Monday
		date = date.AddDate(0, 0, -1)
		isoYear, isoWeek = date.ISOWeek()
	}
	for isoYear < year { // iterate forward to the first day of the first week
		date = date.AddDate(0, 0, 1)
		isoYear, isoWeek = date.ISOWeek()
	}
	for isoWeek < week { // iterate forward to the first day of the given week
		date = date.AddDate(0, 0, 1)
		isoYear, isoWeek = date.ISOWeek()
	}
	return date
}

func formatMonth(input string) string {
	year := ""

	arr := strings.Split(input, "-")
	arr[0] = strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(arr[0], ".", ""), " ", ""))

	if len(arr) == 2 {
		year = "-" + arr[1]
	}

	switch {
	case contains([]string{"i", "янв", "jan", "январь"}, arr[0]):
		return "Янв" + year
	case contains([]string{"ii", "фев", "февраль", "feb"}, arr[0]):
		return "Фев" + year
	case contains([]string{"iii", "мар", "март", "mar"}, arr[0]):
		return "Мар" + year
	case contains([]string{"iv", "апр", "апрель", "apr"}, arr[0]):
		return "Апр" + year
	case contains([]string{"v", "май", "may"}, arr[0]):
		return "Май" + year
	case contains([]string{"vi", "июн", "июнь", "jun"}, arr[0]):
		return "Июн" + year
	case contains([]string{"vii", "июл", "июль", "jul"}, arr[0]):
		return "Июл" + year
	case contains([]string{"viii", "iix", "авг", "август", "aug"}, arr[0]):
		return "Авг" + year
	case contains([]string{"ix", "сен", "сентябрь", "сент", "sep"}, arr[0]):
		return "Сен" + year
	case contains([]string{"x", "х", "окт", "октябрь", "oct"}, arr[0]):
		return "Окт" + year
	case contains([]string{"xi", "ноя", "ноябрь", "нояб", "nov"}, arr[0]):
		return "Ноя" + year
	case contains([]string{"xii", "дек", "декабрь", ""}, arr[0]):
		return "Дек" + year
	default:
		return "undefined"
	}
}

func monthStrToNumber(month string) (int, error) {
	switch month {
	case "Январь":
		return 1, nil
	case "Февраль":
		return 2, nil
	case "Март":
		return 3, nil
	case "Апрель":
		return 4, nil
	case "Май":
		return 5, nil
	case "Июнь":
		return 6, nil
	case "Июль":
		return 7, nil
	case "Август":
		return 8, nil
	case "Сентябрь":
		return 9, nil
	case "Октябрь":
		return 10, nil
	case "Ноябрь":
		return 11, nil
	case "Декабрь":
		return 12, nil
	}
	return 0, fmt.Errorf("wrong month string")
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}
