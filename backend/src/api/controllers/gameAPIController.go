package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

func CreateGameAPI(c *gin.Context) {
	var input struct {
		UserID          uint   `json:"userId" binding:"required"`
		ApiCompanyName  string `json:"apiCompanyName" binding:"required"`
		GameApiName     string `json:"gameApiName" binding:"required"`
		GameCompanyName string `json:"gameCompanyName" binding:"required"`
		GameType        string `json:"gameType" binding:"required"`
		Other           string `json:"other" binding:"required"`
		Type            string `json:"type" binding:"required"`
		WhetherToUse    bool   `json:"whetherToUse" binding:"required"`
		OrderNum        uint   `json:"order"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      false,
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"status": false,
			"error":  err.Error(),
		})
		return
	}

	// Get user from context
	_, err := helpers.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": false,
			"error":  "User not authenticated",
		})
		return
	}

	gameAPI := models.GameAPI{
		ApiCompanyName:  input.ApiCompanyName,
		GameApiName:     input.GameApiName,
		UserID:          input.UserID,
		GameCompanyName: input.GameCompanyName,
		GameType:        input.GameType,
		Other:           input.Other,
		Type:            input.Type,
		WhetherToUse:    input.WhetherToUse,
		OrderNum:        input.OrderNum,
	}

	err = initializers.DB.Create(&gameAPI).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Game API created successfully",
		"status":  true,
		"data":    gameAPI,
	})
}

func GetGameAPI(c *gin.Context) {
	// Get user from context
	user, err := helpers.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": false,
			"error":  "User not authenticated",
		})
		return
	}

	var gameAPIs []models.GameAPI
	err = initializers.DB.Where("user_id = ?", user.ID).Order("created_at DESC").Find(&gameAPIs).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Game API retrieved successfully",
		"status":  true,
		"data":    gameAPIs,
	})
}

func DeleteGameAPIByID(c *gin.Context) {
	var input struct {
		ID uint `json:"id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      false,
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"status": false,
			"error":  err.Error(),
		})
		return
	}

	// Get user from context
	user, err := helpers.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": false,
			"error":  "User not authenticated",
		})
		return
	}

	// Check if Game API exists and belongs to user
	var gameAPI models.GameAPI
	err = initializers.DB.Where("id = ? AND user_id = ?", input.ID, user.ID).First(&gameAPI).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status": false,
			"error":  "Game API not found or unauthorized",
		})
		return
	}

	// Delete the Game API
	err = initializers.DB.Delete(&gameAPI).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Game API deleted successfully",
		"status":  true,
	})
}

func UpdateGameAPIByID(c *gin.Context) {
	var input struct {
		ID uint `json:"id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      false,
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"status": false,
			"error":  err.Error(),
		})
		return
	}

	// Get user from context
	user, err := helpers.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": false,
			"error":  "User not authenticated",
		})
		return
	}

	// Check if Game API exists and belongs to user
	var gameAPI models.GameAPI
	err = initializers.DB.Where("id = ? AND user_id = ?", input.ID, user.ID).First(&gameAPI).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status": false,
			"error":  "Game API not found or unauthorized",
		})
		return
	}

	// Delete the Game API
	err = initializers.DB.Delete(&gameAPI).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Game API deleted successfully",
		"status":  true,
	})
}
