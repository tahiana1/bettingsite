package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/gosimple/slug"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
	"gorm.io/gorm"
)

// CreateLeague creates a new category
func CreateLeague(c *gin.Context) {
	// Get data from request
	var userInput struct {
		Name string `json:"name" binding:"required,min=2"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
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

	// Name unique validation
	if validations.IsUniqueValue("categories", "name", userInput.Name) ||
		validations.IsUniqueValue("categories", "slug", slug.Make(userInput.Name)) {
		c.JSON(http.StatusConflict, gin.H{
			"validations": map[string]interface{}{
				"Name": "The name is already exist!",
			},
		})

		return
	}
	//if err := initializers.DB.Where("name = ?", userInput.Name).
	//	Or("slug = ?", slug.Make(userInput.Name)).
	//	First(&models.League{}).Error; err == nil {
	//	c.JSON(http.StatusConflict, gin.H{
	//		"validations": map[string]interface{}{
	//			"Name": "The name is already exist!",
	//		},
	//	})
	//
	//	return
	//}

	// Create the category
	category := models.League{
		Name: userInput.Name,
	}

	result := initializers.DB.Create(&category)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the category
	c.JSON(http.StatusOK, gin.H{
		"category": category,
	})
}

// Get fetch the all categories
func GetLeagues(c *gin.Context) {
	var leagues []responses.League

	err := initializers.DB.Model(&models.League{}).Preload("Sport", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "code", "name", "icon")
	}).
		Preload("Nation", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "code", "name", "flag")
		}).
		Preload("Fixtures", func(db *gorm.DB) *gorm.DB {
			return db.Preload("HomeTeam").Preload("AwayTeam").Preload("Rates", func(db *gorm.DB) *gorm.DB {
				return db.Preload("Market")
			})
		}).
		Order("order_num asc").
		Find(&leagues).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	//result := initializers.DB.Find(&categories)

	// if err := result.Error; err != nil {
	// 	format_errors.InternalServerError(c, err)
	// 	return
	// }

	// Return the categories
	c.JSON(http.StatusOK, gin.H{
		"data": leagues,
	})
}
