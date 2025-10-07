package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

// GetChargeBonusTableLevels gets charge bonus table data for a specific level and charge bonus number
func GetChargeBonusTableLevels(c *gin.Context) {
	levelID := c.Param("levelId")
	chargeBonusNumber := c.Param("chargeBonusNumber")

	var chargeBonusTables []models.ChargeBonusTableLevel
	result := initializers.DB.Where("level_id = ? AND charge_bonus_number = ?", levelID, chargeBonusNumber).Find(&chargeBonusTables)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"chargeBonusTables": chargeBonusTables,
	})
}

// GetChargeBonusTableLevel gets a single charge bonus table entry
func GetChargeBonusTableLevel(c *gin.Context) {
	id := c.Param("id")

	var chargeBonusTable models.ChargeBonusTableLevel
	result := initializers.DB.First(&chargeBonusTable, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"chargeBonusTable": chargeBonusTable,
	})
}

// CreateChargeBonusTableLevel creates a new charge bonus table entry
func CreateChargeBonusTableLevel(c *gin.Context) {
	var userInput struct {
		LevelID           uint   `json:"levelId" binding:"required"`
		ChargeBonusNumber int    `json:"chargeBonusNumber" binding:"required"`
		Type              string `json:"type" binding:"required"`
		Data              string `json:"data" binding:"required"`
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

	// Validate JSON data
	var jsonData interface{}
	if err := json.Unmarshal([]byte(userInput.Data), &jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON data format",
		})
		return
	}

	chargeBonusTable := models.ChargeBonusTableLevel{
		LevelID:           userInput.LevelID,
		ChargeBonusNumber: userInput.ChargeBonusNumber,
		Type:              userInput.Type,
		Data:              userInput.Data,
	}

	result := initializers.DB.Create(&chargeBonusTable)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"chargeBonusTable": chargeBonusTable,
	})
}

// UpdateChargeBonusTableLevel updates an existing charge bonus table entry
func UpdateChargeBonusTableLevel(c *gin.Context) {
	id := c.Param("id")

	var chargeBonusTable models.ChargeBonusTableLevel
	if err := initializers.DB.First(&chargeBonusTable, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	var userInput struct {
		Data string `json:"data" binding:"required"`
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

	// Validate JSON data
	var jsonData interface{}
	if err := json.Unmarshal([]byte(userInput.Data), &jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON data format",
		})
		return
	}

	// Update the charge bonus table
	result := initializers.DB.Model(&chargeBonusTable).Updates(map[string]interface{}{
		"data": userInput.Data,
	})

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"chargeBonusTable": chargeBonusTable,
	})
}

// DeleteChargeBonusTableLevel deletes a charge bonus table entry
func DeleteChargeBonusTableLevel(c *gin.Context) {
	id := c.Param("id")

	var chargeBonusTable models.ChargeBonusTableLevel
	if err := initializers.DB.First(&chargeBonusTable, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	result := initializers.DB.Delete(&chargeBonusTable)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Charge bonus table entry deleted successfully",
	})
}

// UpsertChargeBonusTableLevel creates or updates charge bonus table data for a specific level and charge bonus number
func UpsertChargeBonusTableLevel(c *gin.Context) {
	var userInput struct {
		LevelID           uint   `json:"levelId" binding:"required"`
		ChargeBonusNumber int    `json:"chargeBonusNumber" binding:"required"`
		Type              string `json:"type" binding:"required"`
		Data              string `json:"data" binding:"required"`
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

	// Validate JSON data
	var jsonData interface{}
	if err := json.Unmarshal([]byte(userInput.Data), &jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON data format",
		})
		return
	}

	// Check if entry exists
	var existingEntry models.ChargeBonusTableLevel
	result := initializers.DB.Where("level_id = ? AND charge_bonus_number = ? AND type = ?",
		userInput.LevelID, userInput.ChargeBonusNumber, userInput.Type).First(&existingEntry)

	if result.Error != nil {
		// Create new entry
		chargeBonusTable := models.ChargeBonusTableLevel{
			LevelID:           userInput.LevelID,
			ChargeBonusNumber: userInput.ChargeBonusNumber,
			Type:              userInput.Type,
			Data:              userInput.Data,
		}

		if err := initializers.DB.Create(&chargeBonusTable).Error; err != nil {
			format_errors.InternalServerError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"chargeBonusTable": chargeBonusTable,
			"message":          "Charge bonus table entry created successfully",
		})
	} else {
		// Update existing entry
		result := initializers.DB.Model(&existingEntry).Updates(map[string]interface{}{
			"data": userInput.Data,
		})

		if err := result.Error; err != nil {
			format_errors.InternalServerError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"chargeBonusTable": existingEntry,
			"message":          "Charge bonus table entry updated successfully",
		})
	}
}
