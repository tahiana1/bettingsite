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

// AdminCreateMiniBetOption creates a new mini bet option (admin only)
func AdminCreateMiniBetOption(c *gin.Context) {
	var userInput struct {
		Name     string              `json:"name" binding:"required,min=2,max=100"`
		Odds     string              `json:"odds" binding:"required"`
		Type     string              `json:"type" binding:"required,oneof=single combination"`
		Ball     *string             `json:"ball,omitempty"`
		Text     *string             `json:"text,omitempty"`
		Balls    []models.BallOption `json:"balls,omitempty"`
		GameType string              `json:"gameType" binding:"required"`
		Category string              `json:"category" binding:"required,oneof=powerball normalball normalballsection oddeven threecombination"`
		Level    int                 `json:"level" binding:"required,min=1,max=15"`
		Enabled  bool                `json:"enabled"`
		OrderNum int                 `json:"orderNum"`
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

// AdminGetMiniBetOptions gets all mini bet options with admin privileges
func AdminGetMiniBetOptions(c *gin.Context) {
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

// AdminGetMiniBetOption gets a single mini bet option by ID (admin)
func AdminGetMiniBetOption(c *gin.Context) {
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

// AdminUpdateMiniBetOption updates a mini bet option (admin)
func AdminUpdateMiniBetOption(c *gin.Context) {
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
		Name     string              `json:"name" binding:"required,min=2,max=100"`
		Odds     string              `json:"odds" binding:"required"`
		Type     string              `json:"type" binding:"required,oneof=single combination"`
		Ball     *string             `json:"ball,omitempty"`
		Text     *string             `json:"text,omitempty"`
		Balls    []models.BallOption `json:"balls,omitempty"`
		GameType string              `json:"gameType" binding:"required"`
		Category string              `json:"category" binding:"required,oneof=powerball normalball normalballsection oddeven threecombination"`
		Level    int                 `json:"level" binding:"required,min=1,max=15"`
		Enabled  bool                `json:"enabled"`
		OrderNum int                 `json:"orderNum"`
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

// AdminDeleteMiniBetOption deletes a mini bet option (admin - hard delete)
func AdminDeleteMiniBetOption(c *gin.Context) {
	id := c.Param("id")
	var miniBetOption models.MiniBetOption

	result := initializers.DB.First(&miniBetOption, id)
	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Hard delete for admin
	result = initializers.DB.Unscoped().Delete(&miniBetOption)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Mini bet option deleted permanently",
	})
}

// AdminToggleMiniBetOption toggles the enabled status of a mini bet option (admin)
func AdminToggleMiniBetOption(c *gin.Context) {
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

// AdminBulkUpdateMiniBetOptions updates multiple mini bet options at once (admin)
func AdminBulkUpdateMiniBetOptions(c *gin.Context) {
	var userInput struct {
		Options []struct {
			ID       uint   `json:"id" binding:"required"`
			Enabled  bool   `json:"enabled"`
			Odds     string `json:"odds"`
			OrderNum int    `json:"orderNum"`
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

// AdminGetMiniGameConfigs gets mini game configurations (admin)
func AdminGetMiniGameConfigs(c *gin.Context) {
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

// AdminUpdateMiniGameConfig updates mini game configuration (admin)
func AdminUpdateMiniGameConfig(c *gin.Context) {
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

// AdminInitializeDefaultMiniBetOptions creates default betting options for a game type
func AdminInitializeDefaultMiniBetOptions(c *gin.Context) {
	var userInput struct {
		GameType string `json:"gameType" binding:"required"`
		Level    int    `json:"level" binding:"required,min=1,max=15"`
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

	// Check if options already exist for this game type and level
	var existingCount int64
	initializers.DB.Model(&models.MiniBetOption{}).Where("game_type = ? AND level = ?", userInput.GameType, userInput.Level).Count(&existingCount)

	if existingCount > 0 {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Default options already exist for this game type and level",
		})
		return
	}

	// Create default powerball options
	powerballOptions := []models.MiniBetOption{
		{Name: "Powerball Odd", Odds: "1.95", Type: "single", Ball: stringPtr("blue"), Text: stringPtr("Odd"), GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 1},
		{Name: "Powerball Even", Odds: "1.95", Type: "single", Ball: stringPtr("red"), Text: stringPtr("Even"), GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 2},
		{Name: "Powerball Under", Odds: "1.95", Type: "single", Ball: stringPtr("blue"), Text: stringPtr("Under"), GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 3},
		{Name: "Powerball Over", Odds: "1.95", Type: "single", Ball: stringPtr("red"), Text: stringPtr("Over"), GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 4},
		{Name: "PaOdd-PaUnder", Odds: "4.1", Type: "combination", Balls: []models.BallOption{{Color: "blue", Text: "Odd"}, {Color: "blue", Text: "Under"}}, GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 5},
		{Name: "PaOdd-PaOver", Odds: "3.1", Type: "combination", Balls: []models.BallOption{{Color: "blue", Text: "Odd"}, {Color: "red", Text: "Over"}}, GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 6},
		{Name: "PaEven-PaUnder", Odds: "3.1", Type: "combination", Balls: []models.BallOption{{Color: "red", Text: "Even"}, {Color: "blue", Text: "Under"}}, GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 7},
		{Name: "PaEven-PaOver", Odds: "4.1", Type: "combination", Balls: []models.BallOption{{Color: "red", Text: "Even"}, {Color: "red", Text: "Over"}}, GameType: userInput.GameType, Category: "powerball", Level: userInput.Level, Enabled: true, OrderNum: 8},
	}

	// Create default normalball options
	normalballOptions := []models.MiniBetOption{
		{Name: "Normalball Odd", Odds: "1.95", Type: "single", Ball: stringPtr("blue"), Text: stringPtr("Odd"), GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 9},
		{Name: "Normalball Even", Odds: "1.95", Type: "single", Ball: stringPtr("red"), Text: stringPtr("Even"), GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 10},
		{Name: "Normalball Under", Odds: "1.95", Type: "single", Ball: stringPtr("blue"), Text: stringPtr("Under"), GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 11},
		{Name: "Normalball Over", Odds: "1.95", Type: "single", Ball: stringPtr("red"), Text: stringPtr("Over"), GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 12},
		{Name: "N-NUnder", Odds: "4.1", Type: "combination", Balls: []models.BallOption{{Color: "blue", Text: "Odd"}, {Color: "blue", Text: "Under"}}, GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 13},
		{Name: "N-NOver", Odds: "3.1", Type: "combination", Balls: []models.BallOption{{Color: "blue", Text: "Odd"}, {Color: "red", Text: "Over"}}, GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 14},
		{Name: "NOdd-NUnder", Odds: "3.1", Type: "combination", Balls: []models.BallOption{{Color: "red", Text: "Even"}, {Color: "blue", Text: "Under"}}, GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 15},
		{Name: "NEven-NOver", Odds: "4.1", Type: "combination", Balls: []models.BallOption{{Color: "red", Text: "Even"}, {Color: "red", Text: "Over"}}, GameType: userInput.GameType, Category: "normalball", Level: userInput.Level, Enabled: true, OrderNum: 16},
	}

	// Combine all options
	allOptions := append(powerballOptions, normalballOptions...)

	// Create all options
	result := initializers.DB.Create(&allOptions)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    allOptions,
		"message": "Default mini bet options created successfully",
	})
}

// Helper function to create string pointer
func stringPtr(s string) *string {
	return &s
}
