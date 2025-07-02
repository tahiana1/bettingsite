package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetEventRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	r.GET("/get-event", controllers.GetEvent)
}
