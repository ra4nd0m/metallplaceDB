package service

import "context"

func (s *Service) GetPropertyId(ctx context.Context, name string) (int, error) {
	return s.repo.GetPropertyId(ctx, name)
}
