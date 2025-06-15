package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// Get fetch the all sports
func GetEvents(c *gin.Context) {

	today := time.Now() //.Truncate(24 * time.Hour)
	events := []models.Event{}
	fmt.Println(today)
	err := initializers.DB.
		Model(&models.Event{}).
		Where("show_from < ?", today).
		Where("show_to > ?", today).
		Where("status = ?", true).
		Find(&events).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": events})

}
