package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/redis"
)

// GetAlerts returns all alerts, optionally filtered by read status
func GetAlerts(c *gin.Context) {
	var alerts []models.Alert
	query := initializers.DB.Order("created_at DESC")

	// Filter by read status if provided
	isRead := c.Query("isRead")
	if isRead == "false" {
		query = query.Where("is_read = ?", false)
	} else if isRead == "true" {
		query = query.Where("is_read = ?", true)
	}

	// Filter by type if provided
	alertType := c.Query("type")
	if alertType != "" {
		query = query.Where("type = ?", alertType)
	}

	// Limit to 100 most recent if not specified
	limit := c.DefaultQuery("limit", "100")
	query = query.Limit(100)
	if limit != "" {
		var limitInt int
		if _, err := fmt.Sscanf(limit, "%d", &limitInt); err == nil && limitInt > 0 && limitInt <= 500 {
			query = query.Limit(limitInt)
		}
	}

	if err := query.Find(&alerts).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": true,
		"data":   alerts,
		"total":  len(alerts),
	})
}

// GetUnreadAlertsCount returns the count of unread alerts
func GetUnreadAlertsCount(c *gin.Context) {
	var count int64
	if err := initializers.DB.Model(&models.Alert{}).Where("is_read = ?", false).Count(&count).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": true,
		"count":  count,
	})
}

// MarkAlertAsRead marks a single alert as read
func MarkAlertAsRead(c *gin.Context) {
	var input struct {
		ID uint `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	var alert models.Alert
	if err := initializers.DB.First(&alert, input.ID).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	now := time.Now()
	alert.IsRead = true
	alert.ReadAt = &now

	if err := initializers.DB.Save(&alert).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Alert marked as read",
		"data":    alert,
	})
}

// MarkAllAlertsAsRead marks all unread alerts as read
func MarkAllAlertsAsRead(c *gin.Context) {
	now := time.Now()
	if err := initializers.DB.Model(&models.Alert{}).
		Where("is_read = ?", false).
		Updates(map[string]interface{}{
			"is_read": true,
			"read_at": now,
		}).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "All alerts marked as read",
	})
}

// DeleteAlert soft deletes an alert
func DeleteAlert(c *gin.Context) {
	var input struct {
		ID uint `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	var alert models.Alert
	if err := initializers.DB.First(&alert, input.ID).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	if err := initializers.DB.Delete(&alert).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Alert deleted successfully",
	})
}

// CreateAlert is a helper function to create alerts (used internally)
func CreateAlert(alertType, title, message string, entityID uint) (*models.Alert, error) {
	alert := models.Alert{
		Type:     alertType,
		Title:    title,
		Message:  message,
		EntityID: entityID,
		IsRead:   false,
	}

	if err := initializers.DB.Create(&alert).Error; err != nil {
		return nil, err
	}

	// Publish alert to Redis for real-time updates
	rdb := redis.Client
	alertJSON, _ := json.Marshal(alert)
	rdb.Publish(context.Background(), "alerts:admin", alertJSON)

	return &alert, nil
}
