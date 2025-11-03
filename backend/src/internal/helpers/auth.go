package helpers

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetAuthUser returns the authenticated user details from the Gin context
func GetAuthUser(ctx context.Context) (*models.User, error) {
	user, ok := ctx.Value("authUser").(*models.User)
	if !ok || user == nil {
		return nil, fmt.Errorf("unauthorized")
	}
	return user, nil
}

// GetAccessDomain returns the domain from the Gin context
func GetAccessDomain(ctx context.Context) (*models.Domain, error) {
	d, ok := ctx.Value("accessDomain").(string)
	if !ok {
		return nil, fmt.Errorf("domain not found in context")
	}

	var domain models.Domain
	if err := initializers.DB.Where("name = ?", d).First(&domain).Error; err != nil {
		return nil, fmt.Errorf("domain not found: %v", err)
	}

	return &domain, nil
}

// GetAuthUser returns the authenticated user details from the Gin context
func GetGinAuthUser(c *gin.Context) (*models.User, error) {
	user, exists := c.Get("authUser")
	if !exists {
		return nil, fmt.Errorf("Failed to get the user")
	}
	return user.(*models.User), nil
}

// UpdateUserOnlineStatus updates the online status of a user
func UpdateUserOnlineStatus(userID uint, onlineStatus bool) error {
	return initializers.DB.Model(&models.User{}).Where("id = ?", userID).Update("online_status", onlineStatus).Error
}

// SetUserOnline sets the user's online status to true
func SetUserOnline(userID uint) error {
	return UpdateUserOnlineStatus(userID, true)
}

// SetUserOffline sets the user's online status to false
func SetUserOffline(userID uint) error {
	return UpdateUserOnlineStatus(userID, false)
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
