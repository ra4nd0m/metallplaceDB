package service

import (
	"context"
	"fmt"
	"github.com/xuri/excelize/v2"
	"log"
	"metallplace/internal/app/model"
	"strconv"
	"time"
)

// InitialImport Importing data from book, using layout written by hand
func (s *Service) InitialImport(ctx context.Context) error {
	dateLayout := "2-Jan-06"

	book, err := excelize.OpenFile("var/analytics.xlsx")
	if err != nil {
		return fmt.Errorf("cannot open exel file %w", err)
	}

	materials := model.InitMaterials

	// Going through init_materials list layout
	for _, material := range materials {
		materialId, err := s.AddUniqueMaterial(ctx, material.Name, material.Source, material.Market, material.Unit)
		if err != nil {
			return err
		}

		log.Printf("Added material %s with id %d", material.Name, materialId)

		for _, property := range material.Properties {
			propertyId, err := s.repo.AddProperty(ctx, property)
			if err != nil {
				return err
			}

			err = s.repo.AddMaterialProperty(ctx, materialId, propertyId)
		}

		// Going through material's properties
		for _, property := range material.Properties {
			log.Printf("\tProcessing property %s", property.Name)
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
					fmt.Println("")
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

				err = s.AddValue(ctx, material.Name, material.Source, property.Name, valueDecimal, valueStr, createdOn)
				if err != nil {
					return err
				}

				row++
				if row%100 == 0 {
					fmt.Print("#")
				}
			}
		}
	}

	return nil
}
