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
	"gorm.io/plugin/dbresolver"
)

// GetUsers function is used to get users list
func GetUsers(c *gin.Context) {
	// Get all the users
	var users []models.User

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB, page, perPage, nil, &users)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}
	initializers.DB.Clauses(dbresolver.Read).Find(&users)
	// Return the users
	c.JSON(http.StatusOK, gin.H{
		"result": result,
		"users":  users,
	})
}

// EditUser function is used to find a user by id
func EditUser(c *gin.Context) {
	// Get the id from url
	id := c.Param("id")

	// Find the user
	var user models.User
	result := initializers.DB.First(&user, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Return the user
	c.JSON(http.StatusOK, gin.H{
		"result": user,
	})
}

// UpdateUser function is used to update a user
func UpdateUser(c *gin.Context) {
	// Get the id from url
	id := c.Param("id")

	// Get the name, email and password from request
	var userInput struct {
		Name   string `json:"name" binding:"required,min=2,max=50"`
		Userid string `json:"email" binding:"required,email"`
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

	// Find the user by id
	var user models.User
	result := initializers.DB.First(&user, id)

	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Userid unique validation
	if user.Userid != userInput.Userid && validations.IsUniqueValue("users", "email", userInput.Userid) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"validations": map[string]interface{}{
				"Userid": "The email is already exist!",
			},
		})
		return
	}

	// Prepare data to update
	updateUser := models.User{
		Name:   userInput.Name,
		Userid: userInput.Userid,
	}

	// Update the user
	result = initializers.DB.Model(&user).Updates(&updateUser)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return the user
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// DeleteUser function is used to delete a user by id
func DeleteUser(c *gin.Context) {
	// Get the id from the url
	id := c.Param("id")
	var user models.User

	result := initializers.DB.First(&user, id)
	if err := result.Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Delete the user
	initializers.DB.Delete(&user)

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"message": "The user has been deleted successfully",
	})
}

// GetTrashedUsers function is used to get all the trashed user
func GetTrashedUsers(c *gin.Context) {
	// Get the users
	var users []models.User

	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	perPageStr := c.DefaultQuery("perPage", "5")
	perPage, _ := strconv.Atoi(perPageStr)

	result, err := pagination.Paginate(initializers.DB.Unscoped().Where("deleted_at IS NOT NULL"), page, perPage, nil, &users)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	//result := initializers.DB.Unscoped().Where("deleted_at IS NOT NULL").Find(&users)
	//if err := result.Error; err != nil {
	//	format_errors.InternalServerError(c, err)
	//	return
	//}

	// Return the users
	c.JSON(http.StatusOK, gin.H{
		"result": result,
	})
}

// PermanentlyDeleteUser function is used to delete a user permanently
func PermanentlyDeleteUser(c *gin.Context) {
	// Get the id from url
	id := c.Param("id")
	var user models.User

	// Find the user
	if err := initializers.DB.Unscoped().First(&user, id).Error; err != nil {
		format_errors.NotFound(c, err)
		return
	}

	// Delete the user
	initializers.DB.Unscoped().Delete(&user)

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"message": "The user has been deleted permanently",
	})
}
