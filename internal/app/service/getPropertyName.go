package service

import "context"

func (s *Service) GetPropertyName(ctx context.Context, id int) (string, error) {
	return s.repo.GetPropertyName(ctx, id)
}
