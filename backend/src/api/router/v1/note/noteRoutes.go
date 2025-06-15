package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetNoteRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	r.POST("/create", controllers.CreateTransaction)
	r.GET("/get", controllers.GetTransaction)
}
