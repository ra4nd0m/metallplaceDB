package service

import (
	"context"
	"fmt"
	"time"
)

func (s *Service) CheckChanges(ctx context.Context, table string, lastReqTime time.Time) (bool, error) {
	dbLastModifiedTime, err := s.repo.GetLastModified(ctx, table)
	if err != nil {
		return false, fmt.Errorf("cant get last modified time: %w", err)
	}
	if dbLastModifiedTime.After(lastReqTime) {
		return true, nil
	}
	return false, nil
}
