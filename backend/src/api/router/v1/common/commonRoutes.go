package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers/common"
)

func GetCommonRoute(r *gin.RouterGroup) {

	// leagues routes
	leaguesRouter := r.Group("/leagues")
	{
		leaguesRouter.GET("", controllers.GetLeagues)
	}
	// sports routes
	sportsRouter := r.Group("/sports")
	{
		sportsRouter.GET("", controllers.GetSports)
	}

}
