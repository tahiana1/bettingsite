package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/pagination"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

// GetLevels gets all levels with pagination
func GetLevels(c *gin.Context) {
	var levels []models.Level

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "15")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB.Order("sort_order ASC"), page, perPage, nil, &levels)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"result": result,
		"levels": levels,
	})
}

// GetLevel gets a single level by ID
func GetLevel(c *gin.Context) {
	id := c.Param("id")

	var level models.Level
	result := initializers.DB.First(&level, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"level": level,
	})
}

// UpdateLevel updates an existing level
func UpdateLevel(c *gin.Context) {
	id := c.Param("id")

	var level models.Level
	if err := initializers.DB.First(&level, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	var userInput models.Level
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

	// Update the level
	result := initializers.DB.Model(&level).Updates(&userInput)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"level": level,
	})
}

// BulkUpdateLevels updates multiple levels at once
func BulkUpdateLevels(c *gin.Context) {
	var userInput struct {
		Levels []models.Level `json:"levels" binding:"required"`
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

	// Start transaction
	tx := initializers.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	for _, level := range userInput.Levels {
		if err := tx.Model(&models.Level{}).Where("id = ?", level.ID).Updates(&level).Error; err != nil {
			tx.Rollback()
			format_errors.InternalServerError(c, err)
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Levels updated successfully",
	})
}

// GetSurpriseBonuses gets surprise bonuses for a specific level
func GetSurpriseBonuses(c *gin.Context) {
	levelID := c.Param("levelId")

	var surpriseBonuses []models.SurpriseBonus
	result := initializers.DB.Where("level_id = ?", levelID).Order("number ASC").Find(&surpriseBonuses)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"surpriseBonuses": surpriseBonuses,
	})
}

// CreateSurpriseBonus creates a new surprise bonus
func CreateSurpriseBonus(c *gin.Context) {
	levelID := c.Param("levelId")

	var userInput models.SurpriseBonus
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

	// Set the level ID
	userInput.LevelID = uint(parseUint(levelID))

	result := initializers.DB.Create(&userInput)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"surpriseBonus": userInput,
	})
}

// UpdateSurpriseBonus updates an existing surprise bonus
func UpdateSurpriseBonus(c *gin.Context) {
	id := c.Param("id")

	var surpriseBonus models.SurpriseBonus
	if err := initializers.DB.First(&surpriseBonus, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	var userInput models.SurpriseBonus
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

	// Update the surprise bonus
	result := initializers.DB.Model(&surpriseBonus).Updates(&userInput)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"surpriseBonus": surpriseBonus,
	})
}

// DeleteSurpriseBonus deletes a surprise bonus
func DeleteSurpriseBonus(c *gin.Context) {
	id := c.Param("id")

	var surpriseBonus models.SurpriseBonus
	if err := initializers.DB.First(&surpriseBonus, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	result := initializers.DB.Delete(&surpriseBonus)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Surprise bonus deleted successfully",
	})
}

// Helper function to parse uint
func parseUint(s string) uint {
	if val, err := strconv.ParseUint(s, 10, 32); err == nil {
		return uint(val)
	}
	return 0
}
