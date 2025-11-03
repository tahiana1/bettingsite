package helpers

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/redis"
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

// NotifyUserLogout sends a logout notification to a user via Redis
// This allows the frontend to detect when an admin has forced the user to logout
func NotifyUserLogout(userID uint) error {
	ctx := context.Background()
	
	// Create logout message
	logoutMessage := map[string]interface{}{
		"type":    "logout",
		"message": "You have been logged out by administrator",
		"userId":  userID,
	}
	
	// Marshal to JSON
	messageBytes, err := json.Marshal(logoutMessage)
	if err != nil {
		return fmt.Errorf("failed to marshal logout message: %v", err)
	}
	
	// Publish to user's private channel
	userIDStr := fmt.Sprintf("%d", userID)
	channel := "private:" + userIDStr
	
	if err := redis.Client.Publish(ctx, channel, messageBytes).Err(); err != nil {
		return fmt.Errorf("failed to publish logout message: %v", err)
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
