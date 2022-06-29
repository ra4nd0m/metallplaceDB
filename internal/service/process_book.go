package service

import (
	"context"
	"github.com/xuri/excelize/v2"
	"metallplace/internal/app/model"
	"metallplace/internal/app/repository"
	"strconv"
	"time"
)

func ProcessBook(ctx context.Context, book *excelize.File, materials []model.Material) error {
	dateLayout := "05.01.2017"

	for _, material := range materials {
		err := repository.AddMaterialAndSource(ctx, material)
		if err != nil {
			return err
		}

		err = repository.AddProperties(ctx, material, material.Properties)
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

				dateStr, err := book.GetCellValue(material.Sheet, material.DateColumn+strconv.Itoa(row))
				if err != nil {
					return err
				}

				createdOn, err := time.Parse(dateLayout, dateStr)
				if err != nil {
					return err
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

				err = repository.AddValue(ctx, material.Name, material.Source, property.Name,
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
