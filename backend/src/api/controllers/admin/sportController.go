package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	models "github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/pagination"
	requests "github.com/hotbrainy/go-betting/backend/internal/request"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

// Get fetch the all sports
func GetSports(c *gin.Context) {
	// Get the sports
	var sports []models.Sport

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB, page, perPage, nil, &sports)

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	//result := initializers.DB.Find(&sports)

	// if err := result.Error; err != nil {
	// 	format_errors.InternalServerError(c, err)
	// 	return
	// }

	// Return the sports
	c.JSON(http.StatusOK, result)
}

// Get fetch the all sports
func CreateSport(c *gin.Context) {
	// Get data from request
	sportRequest := requests.SportRequest{}
	if err := c.ShouldBindJSON(&sportRequest); err != nil {
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

	err := validations.ValidateSport(sportRequest)
	fmt.Println(sportRequest)
	if err != nil {
		fmt.Println(err.Error())
		format_errors.InternalServerError(c, err)
		return
	}

	// Name unique validation
	if validations.IsUniqueValue("sports", "name", sportRequest.Name) {
		c.JSON(http.StatusConflict, gin.H{
			"validations": map[string]interface{}{
				"Name": "The sport name is already exist!",
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

	// Create the sport family
	sportFamily := models.Sport{
		Name:     sportRequest.Name,
		OrderNum: sportRequest.OrderNum,
		ShowYn:   sportRequest.ShowYn,
	}

	result := initializers.DB.Create(&sportFamily)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the category
	c.JSON(http.StatusOK, gin.H{
		"sportFamily": sportFamily,
	})
}
