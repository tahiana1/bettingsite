package router

import (
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetMiniBetOptionRoute(r *gin.RouterGroup) {
	// Public routes (no auth required)
	r.GET("/options", controllers.GetMiniBetOptions)
	r.GET("/options/:id", controllers.GetMiniBetOption)
	r.GET("/configs", controllers.GetMiniGameConfigs)

	// Protected routes (require auth)
	r.Use(middleware.RequireAuth)
	{
		r.POST("/options", controllers.CreateMiniBetOption)
		r.PUT("/options/:id", controllers.UpdateMiniBetOption)
		r.DELETE("/options/:id", controllers.DeleteMiniBetOption)
		r.PATCH("/options/:id/toggle", controllers.ToggleMiniBetOption)
		r.PUT("/options/bulk-update", controllers.BulkUpdateMiniBetOptions)
		r.PUT("/configs", controllers.UpdateMiniGameConfig)
	}
}
