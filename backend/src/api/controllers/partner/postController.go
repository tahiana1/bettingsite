package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/pagination"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
	"gorm.io/gorm"
)

// CreatePost creates a post
func CreatePost(c *gin.Context) {
	// Get user input from request
	var userInput struct {
		Title      string `json:"title" binding:"required,min=2,max=200"`
		Body       string `json:"body" binding:"required"`
		CategoryId uint   `json:"categoryId" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})

			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}

	if !validations.IsExistValue("categories", "id", userInput.CategoryId) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"validations": map[string]interface{}{
				"CategoryId": "The category does not exist!",
			},
		})

		return
	}

	// Create a post
	authUser, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	post := models.Post{
		Title:      userInput.Title,
		Body:       userInput.Body,
		CategoryID: userInput.CategoryId,
		UserID:     authUser.ID,
	}

	result := initializers.DB.Create(&post)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the post
	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

// GetPosts gets all the post
func GetPosts(c *gin.Context) {
	// Get all the posts
	var posts []models.Post

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	preloadFunc := func(query *gorm.DB) *gorm.DB {
		return query.Preload("Category", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, slug")
		}).Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		})
	}

	result, err := pagination.Paginate(initializers.DB, page, perPage, preloadFunc, &posts)

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"response": result,
	})
}

// ShowPost finds a post by ID
func ShowPost(c *gin.Context) {
	// Get the id from url
	id := c.Param("id")

	// Find the post
	var post models.Post
	result := initializers.DB.Preload("Category", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name, slug")
	}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).Preload("Comments", func(db *gorm.DB) *gorm.DB {
		return db.Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		}).Select("id, post_id, user_id, body, created_at")
	}).First(&post, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Return the post
	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

// EditPost finds a post by ID
func EditPost(c *gin.Context) {
	// Get the id from url
	id := c.Param("id")

	// Find the post
	var post models.Post
	result := initializers.DB.Preload("User").Preload("Category").First(&post, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Return the post
	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

func UpdatePost(c *gin.Context) {
	// Get the id from url
	id := c.Param("id")

	// Get the data from request body
	var userInput struct {
		Title      string `json:"title" binding:"required,min=2,max=200"`
		Body       string `json:"body" binding:"required"`
		CategoryId uint   `json:"categoryId" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})

			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Find the post by id
	var post models.Post
	result := initializers.DB.First(&post, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Prepare data to update
	authUser, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}
	updatePost := models.Post{
		Title:      userInput.Title,
		Body:       userInput.Body,
		CategoryID: userInput.CategoryId,
		UserID:     authUser.ID,
	}

	// Update the post
	result = initializers.DB.Model(&post).Updates(&updatePost)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the post

	c.JSON(http.StatusOK, gin.H{
		"post": updatePost,
	})
}

func DeletePost(c *gin.Context) {
	// Get the id from the url
	id := c.Param("id")
	var post models.Post

	result := initializers.DB.First(&post, id)
	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Delete the post
	result = initializers.DB.Delete(&post)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"message": "The post has been deleted successfully",
	})
}

func GetTrashedPosts(c *gin.Context) {
	// Get the posts
	var posts []models.Post

	// result := initializers.DB.Unscoped().Find(&posts)
	//

	// if err := result.Error; err != nil {
	// 	format_errors.InternalServerError(c, err)
	// 	return
	// }

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB.Unscoped().Where("deleted_at IS NOT NULL"), page, perPage, nil, &posts)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the posts
	c.JSON(http.StatusOK, gin.H{
		"result": result,
	})
}

func PermanentlyDeletePost(c *gin.Context) {
	// Get id from url
	id := c.Param("id")
	var post models.Post

	// Find the post
	if err := initializers.DB.Unscoped().First(&post, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Delete the post
	initializers.DB.Unscoped().Delete(&post)

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"message": "The post has been deleted permanently",
	})
}
