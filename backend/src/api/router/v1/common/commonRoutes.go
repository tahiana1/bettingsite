package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers/common"
)

func GetCommonRoute(r *gin.RouterGroup) {

	// leagues routes
	leagueRouter := r.Group("/leagues")
	{
		leagueRouter.GET("", controllers.GetLeagues)
	}
	// sports routes
	sportRouter := r.Group("/sports")
	{
		sportRouter.GET("", controllers.GetSports)
	}

	// sports routes
	notificationRouter := r.Group("/notifications")
	{
		notificationRouter.GET("", controllers.GetNotifications)
	}
}
