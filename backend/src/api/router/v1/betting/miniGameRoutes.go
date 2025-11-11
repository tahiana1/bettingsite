package router

import (
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetMiniGameRoute(r *gin.RouterGroup) {
	// Admin-only endpoints
	adminGroup := r.Group("/")
	adminGroup.Use(middleware.RequireAdminAuth)
	{
		adminGroup.POST("/get-all-miniGameBets", controllers.GetAllMiniGameBetting)
	}

	// Test endpoint without auth (for debugging)
	r.GET("/test-miniGameBets", controllers.GetAllMiniGameBettingTest)
}

