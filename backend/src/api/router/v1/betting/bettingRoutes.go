package router

import (
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetBettingRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	{
		r.POST("/get-betting", controllers.GetBetting)
		r.POST("/create", controllers.CreateBetting)
	}
}
