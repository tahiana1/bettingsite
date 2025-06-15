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

func CreateQna(c *gin.Context) {
	var input struct {
		QuestionTitle string `json:"questionTitle" binding:"required"`
		Question      string `json:"question" binding:"required"`
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

	qna := models.Qna{
		QuestionTitle: input.QuestionTitle,
		Question:      input.Question,
		UserID:        user.ID,
		DomainID:      2,
		Status:        "P",
		Type:          "contact",
	}

	err = initializers.DB.Create(&qna).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Qna created successfully",
		"status":  true,
		"data":    qna,
	})
}

func GetQnaByUserId(c *gin.Context) {
	// Get user from context
	user, err := helpers.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": false,
			"error":  "User not authenticated",
		})
		return
	}

	var qnas []models.Qna
	err = initializers.DB.Where("user_id = ?", user.ID).Order("created_at DESC").Find(&qnas).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Qna retrieved successfully",
		"status":  true,
		"data":    qnas,
	})
}

func DeleteQna(c *gin.Context) {
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

	// Check if QnA exists and belongs to user
	var qna models.Qna
	err = initializers.DB.Where("id = ? AND user_id = ?", input.ID, user.ID).First(&qna).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status": false,
			"error":  "QnA not found or unauthorized",
		})
		return
	}

	// Delete the QnA
	err = initializers.DB.Delete(&qna).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "QnA deleted successfully",
		"status":  true,
	})
}
