package loaders

import (
	"context"
	"fmt"

	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// logReader loads logs from the DB
type logReader struct {
	db *gorm.DB
}

func (lr *logReader) getLogs(ctx context.Context, logIDs []uint) ([]*models.Log, []error) {
	var logs []*models.Log
	err := lr.db.Where("id IN ?", logIDs).Order("order_num").Find(&logs).Error
	if err != nil {
		return nil, []error{err}
	}

	logMap := make(map[uint]*models.Log, len(logs))
	for _, log := range logs {
		logMap[log.ID] = log
	}

	results := make([]*models.Log, len(logIDs))
	errs := make([]error, len(logIDs))
	for i, id := range logIDs {
		if u, ok := logMap[id]; ok {
			results[i] = u
			errs[i] = nil
		} else {
			results[i] = nil
			errs[i] = fmt.Errorf("log not found: %d", id)
		}
	}
	return results, errs
}

// GetProfiles returns many profiles by ids efficiently
func (lr *logReader) GetLogs(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.LogList, error) {
	// loaders := For(ctx)
	// return loaders.LogLoader.LoadAll(ctx, logIDs)

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic in GetLogs:", r)
		}
	}()

	var logs []*models.Log

	db := lr.db.Model(&models.Log{}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid")
	})
	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	db = db.Order("created_at desc")
	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&logs).Error; err != nil {
		return nil, err
	}
	fmt.Println(logs)
	return &model.LogList{
		Logs:  logs,
		Total: int32(count),
	}, nil
}

// GetProfiles returns many profiles by ids efficiently
func GetLog(ctx context.Context, logID uint) (*models.Log, error) {
	loaders := For(ctx)
	return loaders.LogLoader.Load(ctx, logID)
}
