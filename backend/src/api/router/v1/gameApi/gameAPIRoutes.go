package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetGameApiRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	r.POST("/get-game-api", controllers.GetGameAPI)
	r.POST("/create", controllers.CreateGameAPI)
	r.POST("/update", controllers.UpdateGameAPIByID)
	r.POST("/delete", controllers.DeleteGameAPIByID)
}
