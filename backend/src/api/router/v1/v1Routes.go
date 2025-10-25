package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
	adminRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/admin"
	bettingRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/betting"
	commonRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/common"
	miniRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/mini"
	partnerRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/partner"
	transactionRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/transaction"
	userRouter "github.com/hotbrainy/go-betting/backend/api/router/v1/user"
)

func GetV1Route(r *gin.RouterGroup) {

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "BACKEND API RUNNING",
		})
	})
	r.GET("/lang/:locale", controllers.GetLang)

	// Public contact info endpoint
	r.GET("/contact-info", controllers.GetPublicContactInfo)

	r.Use(middleware.LogAuth)

	r.GET("/ws/info", controllers.Info)
	r.GET("/ws", controllers.Upgrade)

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

	// User API routes
	commonRouter.GetCommonRoute(r.Group("/common"))

	// Admin API routes
	adminRouter.GetAdminRoute(r.Group("/admin"))

	// Partner API routes
	partnerRouter.GetPartnerRoute(r.Group("/partner"))

	r.Use(middleware.RequireAuth)
	r.POST("/logout", controllers.Logout)

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

	transactionRouter.GetTransactionRoute(r.Group("/transactions"))

	bettingRouter.GetBettingRoute(r.Group("/bets"))

	// Mini bet options routes
	miniRouter.GetMiniBetOptionRoute(r.Group("/mini"))

	noteRouter := r.Group("/notes")
	{
		noteRouter.POST("/get-notes", controllers.GetNotesByUserId)
		noteRouter.POST("/update-read-status", controllers.UpdateNoteReadStatus)
		noteRouter.POST("/get-unread-notes-count", controllers.GetUnreadNotesCount)
		noteRouter.POST("/delete", controllers.SoftDeleteNote)
	}

	qnaRouter := r.Group("/qna")
	{
		qnaRouter.POST("/get-qna", controllers.GetQnaByUserId)
		qnaRouter.POST("/create", controllers.CreateQna)
		qnaRouter.POST("/delete", controllers.DeleteQna)
	}

	gameApiRouter := r.Group("/game-api")
	{
		gameApiRouter.POST("/get-game-api", controllers.GetGameAPI)
		gameApiRouter.POST("/create", controllers.CreateGameAPI)
		gameApiRouter.POST("/update", controllers.UpdateGameAPIByID)
		gameApiRouter.POST("/delete", controllers.DeleteGameAPIByID)
	}

	eventRouter := r.Group("/event")
	{
		eventRouter.GET("/get-event", controllers.GetEvent)
	}

	casinoRouter := r.Group("/casino")
	{
		casinoRouter.GET("/get-game-link", controllers.GetGameLink)
		casinoRouter.GET("/get-balance", controllers.GetBalance)
		casinoRouter.GET("/add-balance", controllers.AddBalance)
		casinoRouter.GET("/withdraw", controllers.Withdraw)
	}

	slotRouter := r.Group("/slot")
	{
		slotRouter.GET("/get-game-items", controllers.GetGameItems)
		slotRouter.GET("/get-game-launch-link", controllers.GetSlotLaunchLink)
	}
}
