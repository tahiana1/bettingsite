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

// GetSampleQnas gets all sample QNAs with pagination
func GetSampleQnas(c *gin.Context) {
	var sampleQnas []models.SampleQna

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "25")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB, page, perPage, nil, &sampleQnas)

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"response": result,
	})
}

// CreateSampleQna creates a new sample QNA
func CreateSampleQna(c *gin.Context) {
	var userInput struct {
		Site          string `json:"site" binding:"required"`
		AnswerTitle   string `json:"answerTitle" binding:"required"`
		AnswerContent string `json:"answerContent" binding:"required"`
		Use           bool   `json:"use"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
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

	sampleQna := models.SampleQna{
		Site:          userInput.Site,
		AnswerTitle:   userInput.AnswerTitle,
		AnswerContent: userInput.AnswerContent,
		Use:           userInput.Use,
	}

	result := initializers.DB.Create(&sampleQna)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Sample QNA created successfully",
		"data":    sampleQna,
	})
}

// UpdateSampleQna updates an existing sample QNA
func UpdateSampleQna(c *gin.Context) {
	id := c.Param("id")

	var userInput struct {
		Site          string `json:"site" binding:"required"`
		AnswerTitle   string `json:"answerTitle" binding:"required"`
		AnswerContent string `json:"answerContent" binding:"required"`
		Use           bool   `json:"use"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
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

	var sampleQna models.SampleQna
	result := initializers.DB.First(&sampleQna, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Update the sample QNA
	sampleQna.Site = userInput.Site
	sampleQna.AnswerTitle = userInput.AnswerTitle
	sampleQna.AnswerContent = userInput.AnswerContent
	sampleQna.Use = userInput.Use

	result = initializers.DB.Save(&sampleQna)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Sample QNA updated successfully",
		"data":    sampleQna,
	})
}

// DeleteSampleQna deletes a sample QNA
func DeleteSampleQna(c *gin.Context) {
	id := c.Param("id")

	var sampleQna models.SampleQna
	result := initializers.DB.First(&sampleQna, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Delete the sample QNA (soft delete)
	result = initializers.DB.Delete(&sampleQna)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Sample QNA deleted successfully",
	})
}

// UpdateSampleQnaUse updates the use status of a sample QNA
func UpdateSampleQnaUse(c *gin.Context) {
	id := c.Param("id")

	var userInput struct {
		Use bool `json:"use"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": false,
			"error":  err.Error(),
		})
		return
	}

	var sampleQna models.SampleQna
	result := initializers.DB.First(&sampleQna, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Update the use status
	sampleQna.Use = userInput.Use

	result = initializers.DB.Save(&sampleQna)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Sample QNA use status updated successfully",
		"data":    sampleQna,
	})
}

