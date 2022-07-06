package service

import (
	"context"
	"fmt"
	"github.com/xuri/excelize/v2"
	"metallplace/internal/app/model"
	"strconv"
	"time"
)

// InitialImport Importing data from book, using layout written by hand
func (s *Service) InitialImport(ctx context.Context, materials []model.Material) error {
	dateLayout := "2-Jan-06"

	book, err := excelize.OpenFile("var/analytics.xlsx")
	if err != nil {
		return fmt.Errorf("cannot open exel file %w", err)
	}

	// Going through input material list layout
	for _, material := range materials {
		err := s.repo.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit)
		if err != nil {
			return err
		}

		for _, property := range material.Properties {
			err = s.repo.AddProperties(ctx, material.Name, property)
			if err != nil {
				return err
			}
		}

		// Going through material's properties
		for _, property := range material.Properties {
			row := property.Row
			for {
				value, err := book.GetCellValue(material.Sheet, property.Column+strconv.Itoa(row))
				if err != nil {
					return err
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

				if value == "" {
					break
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

				err = s.repo.AddValue(ctx, material.Name, material.Source, property.Name,
					valueDecimal, valueStr, createdOn)
				if err != nil {
					return err
				}

				row++
			}
		}
	}

	return nil
}
