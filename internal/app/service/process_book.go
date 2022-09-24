package service

import (
	"context"
	"fmt"
	"github.com/xuri/excelize/v2"
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
						return err
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

	return firstDayOfISOWeek(year, week), nil
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
