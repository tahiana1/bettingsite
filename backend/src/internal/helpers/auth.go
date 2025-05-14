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

// GetAuthUser returns the authenticated user details from the Gin context
func GetAccessDomain(ctx context.Context) (*models.Domain, error) {
	d, ok := ctx.Value("accessDomain").(string)
	if !ok {
		return nil, fmt.Errorf("unknown")
	}
	dd := &models.Domain{}
	if tx := initializers.DB.Model(&models.Domain{}).Where("name LIKE ?", d).Find(dd); tx.Error != nil {
		return nil, tx.Error
	}
	return dd, nil
}

// GetAuthUser returns the authenticated user details from the Gin context
func GetGinAuthUser(c *gin.Context) (*models.User, error) {
	user, exists := c.Get("authUser")
	if !exists {
		return nil, fmt.Errorf("Failed to get the user")
	}
	return user.(*models.User), nil
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
