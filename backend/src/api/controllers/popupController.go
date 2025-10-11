package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetPopups fetches active popups based on status and date filters
func GetPopups(c *gin.Context) {
	now := time.Now()
	popups := []models.Popup{}

	err := initializers.DB.
		Model(&models.Popup{}).
		Where("status = ?", true).
		Where("show_from <= ?", now).
		Where("show_to >= ?", now).
		Order("order_num ASC").
		Order("created_at DESC").
		Find(&popups).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    popups,
	})
}
