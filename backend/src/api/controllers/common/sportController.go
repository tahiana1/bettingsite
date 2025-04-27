package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/pagination"
	"gorm.io/gorm"
)

// Get fetch the all sports
func GetSports(c *gin.Context) {
	// Get the sports
	var sports []models.Sport

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	preloadFunc := func(query *gorm.DB) *gorm.DB {
		return query.Preload("Leagues", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		})
	}
	result, err := pagination.Paginate(initializers.DB, page, perPage, preloadFunc, &sports)

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
