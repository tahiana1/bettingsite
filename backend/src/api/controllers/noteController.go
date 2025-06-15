package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

func GetNotes(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Query("userid"), 10, 64)
	typeString := c.Query("type")
	transactions := []models.Inbox{}
	err := initializers.DB.
		Model(&models.Inbox{}).
		Where("user_id = ?", id).
		Where("type = ?", typeString).
		Order("id DESC").
		Find(&transactions).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	var profile models.Profile
	err = initializers.DB.
		Model(&models.Profile{}).
		Where("user_id = ?", id).
		Where("deleted_at IS NULL").
		First(&profile).Error

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction created successfully",
		"data":    transactions,
		"balance": profile.Balance,
	})
}

func GetNotesByUserId(c *gin.Context) {
	var input struct {
		UserId uint `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	inboxItems := []models.Inbox{}
	err := initializers.DB.
		Model(&models.Inbox{}).
		Where("user_id = ?", input.UserId).
		Order("id DESC").
		Find(&inboxItems).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Notes retrieved successfully",
		"data":    inboxItems,
	})
}

func UpdateNoteReadStatus(c *gin.Context) {
	var input struct {
		ID uint `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Update the note's openedAt field
	result := initializers.DB.Model(&models.Inbox{}).
		Where("id = ?", input.ID).
		Update("opened_at", time.Now())

	if result.Error != nil {
		format_errors.InternalServerError(c, result.Error)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note read status updated successfully",
		"status":  true,
	})
}

func GetUnreadNotesCount(c *gin.Context) {
	var input struct {
		UserId uint `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var count int64
	err := initializers.DB.
		Model(&models.Inbox{}).
		Where("user_id = ?", input.UserId).
		Where("opened_at IS NULL OR opened_at < ?", time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)).
		Where("deleted_at IS NULL").
		Count(&count).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Unread notes count retrieved successfully",
		"count":   count,
	})
}

func DeleteNote(c *gin.Context) {
	var input struct {
		UserId uint `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	result := initializers.DB.Model(&models.Inbox{}).
		Where("user_id = ?", input.UserId).
		Delete(&models.Inbox{})

	if result.Error != nil {
		format_errors.InternalServerError(c, result.Error)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note deleted successfully",
		"status":  true,
	})
}

func SoftDeleteNote(c *gin.Context) {
	var input struct {
		UserId uint `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Update deleted_at timestamp
	result := initializers.DB.Model(&models.Inbox{}).
		Where("user_id = ?", input.UserId).
		Update("deleted_at", time.Now())

	if result.Error != nil {
		format_errors.InternalServerError(c, result.Error)
		return
	}

	// Get current notes excluding those deleted after 2024
	var notes []models.Inbox
	err := initializers.DB.Model(&models.Inbox{}).
		Where("user_id = ?", input.UserId).
		Where("deleted_at IS NULL OR deleted_at < ?", time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)).
		Find(&notes).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Note soft deleted successfully",
		"status":  true,
		"data":    notes,
	})
}
