package format_errors

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RecordNotFound(c *gin.Context, err error, errMessage ...string) {
	errorMessage := "The record not found"
	if len(errMessage) > 0 {
		errorMessage = errMessage[0]
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   errorMessage,
			"message": err.Error(),
		})
		return
	}

	// Else show internal server error
	InternalServerError(c, err)
}

func BadRequestError(c *gin.Context, err error) {
	c.JSON(http.StatusBadRequest, gin.H{
		"error":   "Bad Request",
		"message": err.Error(),
	})
	return
}

func InternalServerError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"error":   "Internal server error",
		"message": err.Error(),
	})
	return
}
