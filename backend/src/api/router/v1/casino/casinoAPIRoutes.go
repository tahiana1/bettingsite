package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetCasinoRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	r.GET("/get-game-link", controllers.GetGameLink)
	r.GET("/get-balance", controllers.GetBalance)
	r.GET("/add-balance", controllers.AddBalance)
	r.GET("/withdraw", controllers.Withdraw)
}
