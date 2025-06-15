package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetQnaRoute(r *gin.RouterGroup) {
	r.Use(middleware.RequireAuth)
	r.POST("/create", controllers.CreateQna)
	r.POST("/get-qna", controllers.GetQnaByUserId)
	r.POST("/delete", controllers.DeleteQna)
}
