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
	if dbLastModifiedTime.After(lastReqTime.Add(time.Second * 60 * 60 * 3)) {
		return true, nil
	}

	return false, nil
}
