package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
)

// Get fetch the all sports
func GetNotifications(c *gin.Context) {

	today := time.Now() //.Truncate(24 * time.Hour)
	notifications := []responses.Notification{}
	fmt.Println(today)
	err := initializers.DB.
		Model(&models.Notification{}).
		Where("show_from < ?", today).
		Where("show_to > ?", today).
		Find(&notifications).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": notifications})

}
