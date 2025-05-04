package format_errors

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
	"gorm.io/gorm"
)

func NotFound(c *gin.Context, err error, errMessage ...string) {
	errorMessage := "The record not found"
	if len(errMessage) > 0 {
		errorMessage = errMessage[0]
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatusJSON(http.StatusNotFound, responses.Status{
			Error:   err.Error(),
			Message: errorMessage,
		})
		return
	}

	// Else show internal server error
	InternalServerError(c, err)
}

func ConflictError(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusConflict, responses.Status{
		Error:   err.Error(),
		Message: "Conflict Error",
	})
	return
}
func ForbbidenError(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusForbidden, responses.Status{
		Error:   err.Error(),
		Message: "Forbbiden",
	})
	return
}

func UnauthorizedError(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, responses.Status{
		Error:   err.Error(),
		Message: "Unauthorized",
	})
	return
}

func BadRequestError(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusBadRequest, responses.Status{
		Error:   err.Error(),
		Message: "Bad Request!",
	})
	return
}

func InternalServerError(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusInternalServerError, responses.Status{
		Error:   err.Error(),
		Message: "Internal Server Error!",
	})
	return
}
