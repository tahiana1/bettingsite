package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/gosimple/slug"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/pagination"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

// CreateCategory creates a new category
func CreateCategory(c *gin.Context) {
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
	//	First(&models.Category{}).Error; err == nil {
	//	c.JSON(http.StatusConflict, gin.H{
	//		"validations": map[string]interface{}{
	//			"Name": "The name is already exist!",
	//		},
	//	})
	//
	//	return
	//}

	// Create the category
	category := models.Category{
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

// GetCategories fetch the all categories
func GetCategories(c *gin.Context) {
	// Get the categories
	var categories []models.Category

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB, page, perPage, nil, &categories)

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
		"response": result,
	})
}
