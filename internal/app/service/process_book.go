package service

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/xuri/excelize/v2"
	"math"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/utils"
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

	materialsVertical := model.InitMaterialsVertical
	materialHorizontal := model.InitMaterialsHorizontal

	err = db.ExecTx(ctx, func(ctx context.Context) error {

		// Going through init_materials list layout
		for _, material := range materialsVertical {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit)
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
					value, err := book.GetCellValue(material.Sheet, property.Column+strconv.Itoa(row))
					if err != nil {
						return err
					}

					if value == "" {
						break
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

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit)
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
		return fmt.Errorf("cant exec init import vertical tx: %w", err)
	}

	err = db.ExecTx(ctx, func(ctx context.Context) error {
		for _, material := range materialHorizontal {
			materialSourceId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit)
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

					value, err := book.GetCellValue(material.Sheet, utils.IntToAlphabet(int32(col))+strconv.Itoa(property.Row))
					if err != nil {
						return fmt.Errorf("cant get cell value: %w", err)
					}

					if value == "" {
						break
					}
					dateCell := utils.IntToAlphabet(int32(col)) + material.DateRow
					dateStr, err := book.GetCellValue(material.Sheet, dateCell)
					if err != nil {
						return fmt.Errorf("cant get cell value: %w", err)
					}
					createdOn, err := stringToDate(dateStr)
					if err != nil {
						return fmt.Errorf("Can't parce date [%v,%v]: %w", material.Sheet, dateCell, err)
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

					materialSourceId, err := s.repo.GetMaterialSourceId(ctx, material.Name, material.Source, material.Market, material.Unit)
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
		return nil
	})
	if err != nil {
		return fmt.Errorf("cant exec init import horizontal tx: %w", err)
	}

	fmt.Print("Import finished!")
	return nil
}

func (s *Service) ParseBook(path string) ([]byte, error) {
	book, err := excelize.OpenFile(path)
	if err != nil {
		return nil, fmt.Errorf("cannot open exel file %w", err)
	}

	materialStartColumn := "B"
	materialStartRow := 2
	startSheet := "Лист1"
	var chartRaw model.ChartRaw

	labelColumn := "A"
	labelRow := 3

	// Parsing month labels
	for {
		value, err := book.GetCellValue(startSheet, labelColumn+strconv.Itoa(labelRow))
		if err != nil {
			return nil, fmt.Errorf("cant get cell value: %w", err)
		}
		if value == "" {
			isBreak, err := areNextCellsEmpty(book, startSheet, utils.AlphabetToInt(labelColumn), labelRow, 25)
			if err != nil {
				return nil, fmt.Errorf("cant check next n values: %w", err)
			}
			if isBreak {
				break
			}
			labelRow++
			continue
		}
		chartRaw.Labels = append(chartRaw.Labels, formatMonth(value))
		labelRow++
	}

	for curCol := utils.AlphabetToInt(materialStartColumn); true; curCol++ {
		var val float64
		curRow := materialStartRow
		var materialAndPrices model.MaterialAndPrices
		value, err := book.GetCellValue(startSheet, utils.IntToAlphabet(int32(curCol))+strconv.Itoa(materialStartRow))
		if err != nil {
			return nil, fmt.Errorf("cant get cell value: %w", err)
		}
		if value == "" {
			break
		}
		materialAndPrices.Name = value

		for row := curRow + 1; true; row++ {
			value, err = book.GetCellValue(startSheet, utils.IntToAlphabet(int32(curCol))+strconv.Itoa(row))
			if err != nil {
				return nil, fmt.Errorf("cant get cell value col %d, row %d: %w", row, curCol, err)
			}
			if value == "" {
				isBreak, err := areNextCellsEmpty(book, startSheet, curCol, row, 10)
				if err != nil {
					return nil, fmt.Errorf("cant check next n values: %w", err)
				}
				if isBreak {
					break
				}
			} else {
				val, err = strconv.ParseFloat(value, 64)
				if err != nil {
					return nil, fmt.Errorf("cant convert string to float: %w", err)
				}
			}
			materialAndPrices.Values = append(materialAndPrices.Values, math.Round(val*100)/100)
		}
		chartRaw.MaterialAndPrices = append(chartRaw.MaterialAndPrices, materialAndPrices)
	}

	j, err := json.Marshal(chartRaw)
	if err != nil {
		return nil, fmt.Errorf("cant pack json: %w", err)
	}
	return j, nil
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

func stringToDate(str string) (time.Time, error) {
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
	fri := mon.AddDate(0, 0, 4)
	return fri, nil
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
	case contains([]string{"ii", "фев", "февраль"}, arr[0]):
		return "Фев" + year
	case contains([]string{"iii", "мар", "март"}, arr[0]):
		return "Мар" + year
	case contains([]string{"iv", "апр", "апрель"}, arr[0]):
		return "Апр" + year
	case contains([]string{"v", "май"}, arr[0]):
		return "Май" + year
	case contains([]string{"vi", "июн", "июнь"}, arr[0]):
		return "Июн" + year
	case contains([]string{"vii", "июл", "июль"}, arr[0]):
		return "Июл" + year
	case contains([]string{"viii", "iix", "авг", "август"}, arr[0]):
		return "Авг" + year
	case contains([]string{"ix", "сен", "сентябрь"}, arr[0]):
		return "Сен" + year
	case contains([]string{"x", "х", "окт", "октябрь"}, arr[0]):
		return "Окт" + year
	case contains([]string{"xi", "ноя", "ноябрь"}, arr[0]):
		return "Ноя" + year
	case contains([]string{"xii", "дек", "декабрь"}, arr[0]):
		return "Дек" + year
	default:
		return "undefined"
	}
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}
