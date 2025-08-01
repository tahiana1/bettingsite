package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetSlotRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	r.GET("/get-game-items", controllers.GetGameItems)
	r.GET("/get-game-launch-link", controllers.GetSlotLaunchLink)
}
