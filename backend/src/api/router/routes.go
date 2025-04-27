package router

import (
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/router/v1"
)

func GetAPIRoute(r *gin.Engine) {
	apiV1Router := r.Group("/api/v1")
	{
		router.GetV1Route(apiV1Router)
	}
}
