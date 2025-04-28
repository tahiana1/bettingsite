package helpers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetAuthUser returns the authenticated user details from the Gin context
func GetAuthUser(c *gin.Context) *models.User {
	authUser, exists := c.Get("authUser")
	str, err := (json.Marshal(authUser))
	fmt.Println(string(str), err)
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get the user",
		})
		return nil
	}

	if user, ok := authUser.(models.User); ok {
		return &user
	}

	return nil
}

//func getAuthId(c *gin.Context) (uint, bool) {
//user, ok := GetAuthUser(c)
//
//if !ok {
//	return 0, false
//}

//userId, ok := user.ID.(uint)
//
//if !ok {
//	return 0, false
//}
//
//return userId, true
//}
