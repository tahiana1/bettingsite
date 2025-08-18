package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

func GetEvent(c *gin.Context) {
	var events []models.Event
	if err := initializers.DB.Where("status = ?", true).Order("created_at DESC").Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}
