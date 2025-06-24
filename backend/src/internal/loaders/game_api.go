package loaders

import (
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetGameAPIsWithOrder fetches GameAPI records with optional pagination and ordering
func GetGameAPIsWithOrder(limit, offset int, orderField, orderDirection string) ([]models.GameAPI, int64, error) {
	var gameAPIs []models.GameAPI
	var total int64
	db := initializers.DB.Model(&models.GameAPI{})
	db.Count(&total)
	if orderField != "" && (orderDirection == "ASC" || orderDirection == "DESC") {
		db = db.Order(orderField + " " + orderDirection)
	}
	if limit > 0 {
		db = db.Limit(limit)
	}
	if offset > 0 {
		db = db.Offset(offset)
	}
	if err := db.Find(&gameAPIs).Error; err != nil {
		return nil, 0, err
	}
	return gameAPIs, total, nil
}
