package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
	adminRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/admin"
	commonRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/common"
	partnerRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/partner"
	userRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/user"
)

func GetV1Route(r *gin.RouterGroup) {
	r.Use(middleware.CheckAuth)

	r.Any("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "BACKEND API RUNNING",
		})
	})

	gqlRouter := r.Group("/graphql")
	{
		gqlRouter.Any("", controllers.GraphqlHandler())
		gqlRouter.Any("/playground", controllers.PlaygroundHandler())
	}

	// User routes
	authRouter := r.Group("/auth")
	{
		authRouter.POST("/signup", controllers.SignUp)
		authRouter.POST("/login", controllers.Login)
		authRouter.Use(middleware.RequireAuth)
		authRouter.POST("/logout", controllers.Logout)
	}

	r.GET("/lang/:locale", controllers.GetLang)
	// User API routes
	commonRouter.GetCommonRoute(r.Group("/common"))

	r.Use(middleware.RequireAuth)
	r.POST("/logout", controllers.Logout)
	// Admin API routes
	adminRouter.GetAdminRoute(r.Group("/admin"))

	// Partner API routes
	partnerRouter.GetPartnerRoute(r.Group("/partner"))

	// User API routes
	userRouter.GetUserRoute(r.Group("/user"))

	r.POST("/upload", controllers.Upload)
	// Post routes
	postRouter := r.Group("/posts")
	{
		postRouter.GET("/", controllers.GetPosts)
		postRouter.POST("/create", controllers.CreatePost)
		postRouter.GET("/:id/show", controllers.ShowPost)
		postRouter.GET(":id/edit", controllers.EditPost)
		postRouter.PUT("/:id/update", controllers.UpdatePost)
		postRouter.DELETE("/:id/delete", controllers.DeletePost)
		postRouter.GET("/all-trash", controllers.GetTrashedPosts)
		postRouter.DELETE("/delete-permanent/:id", controllers.PermanentlyDeletePost)
	}

	// Comment routes
	commentRouter := r.Group("/posts/:id/comment")
	{
		commentRouter.POST("/store", controllers.CommentOnPost)
		commentRouter.GET("/:comment_id/edit", controllers.EditComment)
		commentRouter.PUT("/:comment_id/update", controllers.UpdateComment)
		commentRouter.DELETE("/:comment_id/delete", controllers.DeleteComment)
	}

}
