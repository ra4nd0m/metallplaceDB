package repository

import (
	"context"
	"fmt"
	"metallplace/internal/pkg/db"
)

// AddUniqueMaterial Adding source and product name if not exists, the tying them by id in Material_Source
func (r *Repository) AddUniqueMaterial(ctx context.Context, materialName string, materialSource string, materialMarket string, materialUnit string) error {
	_, err := db.FromContext(ctx).Exec(
		`INSERT INTO source (name, url) VALUES ($1, $1) ON CONFLICT (name) DO UPDATE SET url=$1`, materialSource)
	if err != nil {
		return fmt.Errorf("Can't add source %w", err)
	}

	_, err = db.FromContext(ctx).Exec(
		`INSERT INTO material (name) VALUES ($1) ON CONFLICT DO NOTHING`,
		materialName)
	if err != nil {
		return fmt.Errorf("Can't add material %w", err)
	}

	// tying material, source, unit and market - creating unique material
	_, err = db.FromContext(ctx).Exec(
		`INSERT INTO material_source (material_id, source_id, target_market, unit) 
		VALUES ((SELECT id FROM material WHERE name=$1), (SELECT id FROM source WHERE name=$2), $3, $4) 
		ON CONFLICT DO NOTHING`,
		materialName, materialSource, materialMarket, materialUnit)

	if err != nil {
		return fmt.Errorf("Can't tie material, source, unit and market %w", err)
	}

	return nil
}
