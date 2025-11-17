package controllers

import (
	"fmt"
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
		DomainID      *uint  `json:"domainId"`
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
	user, err := helpers.GetGinAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": false,
			"error":  "User not authenticated",
		})
		return
	}

	// Get domain - prefer domainId from request, otherwise get from context
	var domainID uint
	if input.DomainID != nil {
		// Validate that the provided domain exists
		var domain models.Domain
		if err := initializers.DB.Where("id = ?", *input.DomainID).First(&domain).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status": false,
				"error":  fmt.Sprintf("Domain with ID %d not found", *input.DomainID),
			})
			return
		}
		domainID = *input.DomainID
	} else {
		// Get domain from context
		domain, err := helpers.GetGinAccessDomain(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status": false,
				"error":  "Domain not found in context. Please provide domainId in request.",
			})
			return
		}
		domainID = domain.ID
	}

	qna := models.Qna{
		QuestionTitle: input.QuestionTitle,
		Question:      input.Question,
		UserID:        user.ID,
		DomainID:      domainID,
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
	user, err := helpers.GetGinAuthUser(c)
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
	user, err := helpers.GetGinAuthUser(c)
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
