package router

import (
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetBettingRoute(r *gin.RouterGroup) {
	authGroup := r.Group("/")
	authGroup.Use(middleware.RequireAuth)
	{
		authGroup.POST("/get-betting", controllers.GetBetting)
		authGroup.POST("/get-casinoBet", controllers.GetCasinoBetting)
		authGroup.POST("/create", controllers.CreateBetting)
	}

	// Admin-only endpoints
	adminGroup := r.Group("/")
	adminGroup.Use(middleware.RequireAdminAuth)
	{
		adminGroup.POST("/get-all-casinoBets", controllers.GetAllCasinoBetting)
	}

	// Test endpoint without auth (for debugging)
	r.GET("/test-casinoBets", controllers.GetAllCasinoBettingTest)
}
