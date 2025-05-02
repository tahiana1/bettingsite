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
	"gorm.io/gorm"
)

// Get fetch the all sportFamilies
func GetLeagues(c *gin.Context) {
	// Get the sportFamilies

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	preloadFunc := func(query *gorm.DB) *gorm.DB {
		return query.Preload("Admin", func(db *gorm.DB) *gorm.DB {
			return db.Select("ID, Name")
		}).Preload("Sport", func(db *gorm.DB) *gorm.DB {
			return db.Select("ID, Name")
		})
	}
	var sportFamilies []models.League

	result, err := pagination.Paginate(initializers.DB, page, perPage, preloadFunc, &sportFamilies)

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	//result := initializers.DB.Find(&sportFamilies)

	// if err := result.Error; err != nil {
	// 	format_errors.InternalServerError(c, err)
	// 	return
	// }

	// Return the sportFamilies
	c.JSON(http.StatusOK, result)
}

// Get fetch the all sportFamilies
func CreateLeague(c *gin.Context) {
	// Get data from request
	leagueRequest := requests.LeagueRequest{}
	if err := c.ShouldBindJSON(&leagueRequest); err != nil {
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

	err := validations.ValidateLeague(leagueRequest)
	fmt.Println(leagueRequest)
	if err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	// Name unique validation
	// if validations.IsUniqueValue("sport_families", "name", leagueRequest.Name) {
	// 	c.JSON(http.StatusConflict, gin.H{
	// 		"validations": map[string]interface{}{
	// 			"Name": "The sport family name is already exist!",
	// 		},
	// 	})

	// 	return
	// }
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
	// authID := helpers.GetGinAuthUser(c).ID

	// Create the sport family
	league := models.League{
		Name: leagueRequest.Name,
	}

	result := initializers.DB.Create(&league)

	if err := result.Error; err != nil {
		fmt.Println(err.Error())
		format_errors.BadRequestError(c, err)
		return
	}

	// Return the category
	c.JSON(http.StatusOK, gin.H{
		"league": league,
	})
}

// Get fetch the all sportFamilies
func UpdateLeague(c *gin.Context) {
	// Get data from request
	leagueRequest := requests.LeagueRequest{}
	if err := c.ShouldBindJSON(&leagueRequest); err != nil {
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

	err := validations.ValidateLeague(leagueRequest)
	fmt.Println(leagueRequest)
	if err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	// Name unique validation
	// if validations.IsUniqueValue("sport_families", "name", leagueRequest.Name) {
	// 	c.JSON(http.StatusConflict, gin.H{
	// 		"validations": map[string]interface{}{
	// 			"Name": "The sport family name is already exist!",
	// 		},
	// 	})

	// 	return
	// }
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
	// authID := helpers.GetGinAuthUser(c).ID

	// Create the sport family
	league := models.League{
		Name: leagueRequest.Name,
	}

	result := initializers.DB.Create(&league)

	if err := result.Error; err != nil {
		fmt.Println(err.Error())
		format_errors.BadRequestError(c, err)
		return
	}

	// Return the category
	c.JSON(http.StatusOK, gin.H{
		"league": league,
	})
}
