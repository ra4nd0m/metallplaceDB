package repository

import (
	"context"
	"fmt"
	"metallplace/internal/app/model"
	"metallplace/internal/pkg/db"
)

func (r *Repository) AddMaterialAndSource(ctx context.Context, material model.Material) error {
	_, err := db.FromContext(ctx).Exec(
		`INSERT INTO source (name, url) VALUES ($1, $1) ON CONFLICT (name) DO UPDATE SET url=$1`, material.Source)
	if err != nil {
		return fmt.Errorf("Can't add source %w", err)
	}

	_, err = db.FromContext(ctx).Exec(
		`INSERT INTO material (name) VALUES ($1) ON CONFLICT DO NOTHING`,
		material.Name)
	if err != nil {
		return fmt.Errorf("Can't add material %w", err)
	}

	// tying material, source, unit and market - creating unique material
	_, err = db.FromContext(ctx).Exec(
		`INSERT INTO material_source (material_id, source_id, target_market, unit) 
		VALUES ((SELECT id FROM material WHERE name=$1), (SELECT id FROM source WHERE name=$2), $3, $4) 
		ON CONFLICT DO NOTHING`,
		material.Name, material.Source, material.Market, material.Unit)

	if err != nil {
		return fmt.Errorf("Can't tie material, source, unit and market %w", err)
	}

	return nil
}
