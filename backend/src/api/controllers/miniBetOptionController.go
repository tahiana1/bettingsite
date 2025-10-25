package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

// CreateMiniBetOption creates a new mini bet option
func CreateMiniBetOption(c *gin.Context) {
	var userInput struct {
		Name     string                 `json:"name" binding:"required,min=2,max=100"`
		Odds     string                 `json:"odds" binding:"required"`
		Type     string                 `json:"type" binding:"required,oneof=single combination"`
		Ball     *string                `json:"ball,omitempty"`
		Text     *string                `json:"text,omitempty"`
		Balls    []models.BallOption    `json:"balls,omitempty"`
		GameType string                 `json:"gameType" binding:"required"`
		Category string                 `json:"category" binding:"required,oneof=powerball normalball"`
		Level    int                    `json:"level" binding:"required,min=1,max=15"`
		Enabled  bool                   `json:"enabled"`
		OrderNum int                    `json:"orderNum"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Validate type-specific fields
	if userInput.Type == "single" {
		if userInput.Ball == nil || userInput.Text == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Ball and Text are required for single type bets",
			})
			return
		}
	} else if userInput.Type == "combination" {
		if len(userInput.Balls) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Balls are required for combination type bets",
			})
			return
		}
	}

	// Create the mini bet option
	miniBetOption := models.MiniBetOption{
		Name:     userInput.Name,
		Odds:     userInput.Odds,
		Type:     userInput.Type,
		Ball:     userInput.Ball,
		Text:     userInput.Text,
		Balls:    userInput.Balls,
		GameType: userInput.GameType,
		Category: userInput.Category,
		Level:    userInput.Level,
		Enabled:  userInput.Enabled,
		OrderNum: userInput.OrderNum,
	}

	result := initializers.DB.Create(&miniBetOption)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    miniBetOption,
		"message": "Mini bet option created successfully",
	})
}

// GetMiniBetOptions gets all mini bet options with optional filtering
func GetMiniBetOptions(c *gin.Context) {
	var miniBetOptions []models.MiniBetOption
	
	// Get query parameters for filtering
	gameType := c.Query("gameType")
	category := c.Query("category")
	levelStr := c.Query("level")
	enabledStr := c.Query("enabled")

	query := initializers.DB.Model(&models.MiniBetOption{})

	// Apply filters
	if gameType != "" {
		query = query.Where("game_type = ?", gameType)
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}
	if levelStr != "" {
		if level, err := strconv.Atoi(levelStr); err == nil {
			query = query.Where("level = ?", level)
		}
	}
	if enabledStr != "" {
		if enabled, err := strconv.ParseBool(enabledStr); err == nil {
			query = query.Where("enabled = ?", enabled)
		}
	}

	// Order by order_num and created_at
	query = query.Order("order_num ASC, created_at ASC")

	result := query.Find(&miniBetOptions)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    miniBetOptions,
		"count":   len(miniBetOptions),
	})
}

// GetMiniBetOption gets a single mini bet option by ID
func GetMiniBetOption(c *gin.Context) {
	id := c.Param("id")
	var miniBetOption models.MiniBetOption

	result := initializers.DB.First(&miniBetOption, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    miniBetOption,
	})
}

// UpdateMiniBetOption updates a mini bet option
func UpdateMiniBetOption(c *gin.Context) {
	id := c.Param("id")
	var miniBetOption models.MiniBetOption

	// Find the mini bet option
	result := initializers.DB.First(&miniBetOption, id)
	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Get update data from request body
	var userInput struct {
		Name     string                 `json:"name" binding:"required,min=2,max=100"`
		Odds     string                 `json:"odds" binding:"required"`
		Type     string                 `json:"type" binding:"required,oneof=single combination"`
		Ball     *string                `json:"ball,omitempty"`
		Text     *string                `json:"text,omitempty"`
		Balls    []models.BallOption    `json:"balls,omitempty"`
		GameType string                 `json:"gameType" binding:"required"`
		Category string                 `json:"category" binding:"required,oneof=powerball normalball"`
		Level    int                    `json:"level" binding:"required,min=1,max=15"`
		Enabled  bool                   `json:"enabled"`
		OrderNum int                    `json:"orderNum"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Validate type-specific fields
	if userInput.Type == "single" {
		if userInput.Ball == nil || userInput.Text == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Ball and Text are required for single type bets",
			})
			return
		}
	} else if userInput.Type == "combination" {
		if len(userInput.Balls) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Balls are required for combination type bets",
			})
			return
		}
	}

	// Update the mini bet option
	miniBetOption.Name = userInput.Name
	miniBetOption.Odds = userInput.Odds
	miniBetOption.Type = userInput.Type
	miniBetOption.Ball = userInput.Ball
	miniBetOption.Text = userInput.Text
	miniBetOption.Balls = userInput.Balls
	miniBetOption.GameType = userInput.GameType
	miniBetOption.Category = userInput.Category
	miniBetOption.Level = userInput.Level
	miniBetOption.Enabled = userInput.Enabled
	miniBetOption.OrderNum = userInput.OrderNum

	result = initializers.DB.Save(&miniBetOption)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    miniBetOption,
		"message": "Mini bet option updated successfully",
	})
}

// DeleteMiniBetOption deletes a mini bet option (soft delete)
func DeleteMiniBetOption(c *gin.Context) {
	id := c.Param("id")
	var miniBetOption models.MiniBetOption

	result := initializers.DB.First(&miniBetOption, id)
	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Soft delete
	result = initializers.DB.Delete(&miniBetOption)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Mini bet option deleted successfully",
	})
}

// ToggleMiniBetOption toggles the enabled status of a mini bet option
func ToggleMiniBetOption(c *gin.Context) {
	id := c.Param("id")
	var miniBetOption models.MiniBetOption

	result := initializers.DB.First(&miniBetOption, id)
	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Toggle enabled status
	miniBetOption.Enabled = !miniBetOption.Enabled

	result = initializers.DB.Save(&miniBetOption)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    miniBetOption,
		"message": "Mini bet option status toggled successfully",
	})
}

// BulkUpdateMiniBetOptions updates multiple mini bet options at once
func BulkUpdateMiniBetOptions(c *gin.Context) {
	var userInput struct {
		Options []struct {
			ID       uint  `json:"id" binding:"required"`
			Enabled  bool  `json:"enabled"`
			Odds     string `json:"odds"`
			OrderNum int   `json:"orderNum"`
		} `json:"options" binding:"required"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Update each option
	for _, option := range userInput.Options {
		var miniBetOption models.MiniBetOption
		result := initializers.DB.First(&miniBetOption, option.ID)
		if err := result.Error; err != nil {
			continue // Skip if not found
		}

		miniBetOption.Enabled = option.Enabled
		if option.Odds != "" {
			miniBetOption.Odds = option.Odds
		}
		miniBetOption.OrderNum = option.OrderNum

		initializers.DB.Save(&miniBetOption)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Mini bet options updated successfully",
	})
}

// GetMiniGameConfigs gets mini game configurations
func GetMiniGameConfigs(c *gin.Context) {
	var configs []models.MiniGameConfig
	
	gameType := c.Query("gameType")
	levelStr := c.Query("level")

	query := initializers.DB.Model(&models.MiniGameConfig{})

	if gameType != "" {
		query = query.Where("game_type = ?", gameType)
	}
	if levelStr != "" {
		if level, err := strconv.Atoi(levelStr); err == nil {
			query = query.Where("level = ?", level)
		}
	}

	result := query.Find(&configs)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    configs,
	})
}

// UpdateMiniGameConfig updates mini game configuration
func UpdateMiniGameConfig(c *gin.Context) {
	var userInput struct {
		GameType        string  `json:"gameType" binding:"required"`
		Level           int     `json:"level" binding:"required,min=1,max=15"`
		MaxBettingValue float64 `json:"maxBettingValue" binding:"required,min=1"`
		MinBettingValue float64 `json:"minBettingValue" binding:"required,min=1"`
		IsActive        bool    `json:"isActive"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Find or create config
	var config models.MiniGameConfig
	result := initializers.DB.Where("game_type = ? AND level = ?", userInput.GameType, userInput.Level).First(&config)

	if err := result.Error; err != nil {
		// Create new config if not found
		config = models.MiniGameConfig{
			GameType:        userInput.GameType,
			Level:           userInput.Level,
			MaxBettingValue: userInput.MaxBettingValue,
			MinBettingValue: userInput.MinBettingValue,
			IsActive:        userInput.IsActive,
		}
		result = initializers.DB.Create(&config)
	} else {
		// Update existing config
		config.MaxBettingValue = userInput.MaxBettingValue
		config.MinBettingValue = userInput.MinBettingValue
		config.IsActive = userInput.IsActive
		result = initializers.DB.Save(&config)
	}

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    config,
		"message": "Mini game configuration updated successfully",
	})
}

