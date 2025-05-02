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

// CommentOnPost comments on a post
func CommentOnPost(c *gin.Context) {
	// Get data from request
	var userInput struct {
		PostId uint   `json:"postId" binding:"required,min=1"`
		Body   string `json:"body" binding:"required,min=1"`
	}

	err := c.ShouldBindJSON(&userInput)

	// Validate the data
	if err != nil {
		if errors, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errors),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if !validations.IsExistValue("posts", "id", userInput.PostId) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"validations": map[string]interface{}{
				"PostId": "The post does not exist",
			},
		})
		return
	}

	// Store the comment
	authUser, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	comment := models.Comment{
		PostID: userInput.PostId,
		UserID: authUser.ID,
		Body:   userInput.Body,
	}

	result := initializers.DB.Create(&comment)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the comment
	c.JSON(http.StatusOK, gin.H{
		"comment": comment,
	})
}

// EditComment finds a comment by id
func EditComment(c *gin.Context) {
	// Get the comment id from url
	id := c.Param("comment_id")

	// Find the comment
	var comment models.Comment
	result := initializers.DB.First(&comment, id)

	if err := result.Error; err != nil {
		format_errors.RecordNotFound(c, err)
		return
	}

	// Return the comment
	c.JSON(http.StatusOK, gin.H{
		"comment": comment,
	})
}

// UpdateComment updates a comment of a post
func UpdateComment(c *gin.Context) {
	// Get the id from url
	id := c.Param("comment_id")

	var userInput struct {
		Body string `json:"body" binding:"required,min=1"`
	}

	// Validate in request
	err := c.ShouldBindJSON(&userInput)

	// Validate the data
	if err != nil {
		if errors, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"validations": validations.FormatValidationErrors(errors),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Find the comment
	var comment models.Comment
	result := initializers.DB.First(&comment, id)

	if err := result.Error; err != nil {
		format_errors.RecordNotFound(c, err)
		return
	}

	// Update the comment
	comment.Body = userInput.Body
	result = initializers.DB.Save(&comment)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the comment
	c.JSON(http.StatusOK, gin.H{
		"comment": comment,
	})
}

func DeleteComment(c *gin.Context) {
	// Get the id from url
	id := c.Param("comment_id")

	// Find the comment
	var comment models.Comment
	result := initializers.DB.First(&comment, id)

	if err := result.Error; err != nil {
		format_errors.RecordNotFound(c, err)
		return
	}

	// Delete the comment
	result = initializers.DB.Delete(&comment)
	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"message": "The comment has been deleted successfully!",
	})
}
