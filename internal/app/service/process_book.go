package service

import (
	"context"
	"fmt"
	"github.com/xuri/excelize/v2"
	"metallplace/internal/app/model"
	"strconv"
	"time"
)

func (s *Service) InitialImport(ctx context.Context, book *excelize.File, materials []model.Material) error {
	dateLayout := "2-Jan-06"

	for _, material := range materials {
		err := s.repo.AddMaterialAndSource(ctx, material)
		if err != nil {
			return err
		}

		err = s.repo.AddProperties(ctx, material, material.Properties)
		if err != nil {
			return err
		}

		for _, property := range material.Properties {
			row := property.Row
			for {
				value, err := book.GetCellValue(material.Sheet, property.Column+strconv.Itoa(row))
				if err != nil {
					return err
				}

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

				createdOn, err := time.Parse(dateLayout, dateStr)
				if err != nil {
					return fmt.Errorf("Can't parce date [%v,%v] '%v' (%v): %w", material.Sheet, dateCell, dateStr, dateType, err)
				}

				if value == "" {
					break
				}

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
