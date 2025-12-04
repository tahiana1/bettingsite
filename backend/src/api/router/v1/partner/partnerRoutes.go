package router

import (
	"fmt"

	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers/partner"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetPartnerRoute(r *gin.RouterGroup) {
	fmt.Println("✅ Partner routes being registered...")

	// Apply middleware to ALL partner routes
	r.Use(middleware.RequirePartnerAuth)

	// Inbox/Notes routes
	r.GET("/inboxes", controllers.GetPartnerInboxes)
	r.GET("/inboxes/users", controllers.GetPartnerUsers)
	r.POST("/inboxes/create", controllers.CreatePartnerInbox)
	r.PUT("/inboxes/:id/update", controllers.UpdatePartnerInbox)
	r.DELETE("/inboxes/:id/delete", controllers.DeletePartnerInbox)

	// QNA/Support Center routes
	r.GET("/qnas", controllers.GetPartnerQnas)
	r.POST("/qnas/:id/reply", controllers.ReplyPartnerQna)
	r.PUT("/qnas/:id/status", controllers.UpdatePartnerQnaStatus)
	r.POST("/qnas/:id/complete", controllers.CompletePartnerQna)
	r.DELETE("/qnas/:id/delete", controllers.DeletePartnerQna)

	// Betting Status routes
	r.POST("/betting/casino", controllers.GetPartnerCasinoBetting)
	r.POST("/betting/minigame", controllers.GetPartnerMiniGameBetting)

	// Transaction routes
	r.GET("/transactions", controllers.GetPartnerTransactions)
	r.GET("/transactions/rolling", controllers.GetPartnerRollingTransactions)
	r.GET("/transactions/point", controllers.GetPartnerPointTransactions)

	// Member management routes
	memberRouter := r.Group("/member-management")
	{
		memberRouter.POST("/direct-members/register", controllers.RegisterDirectMember)
		memberRouter.GET("/direct-members", controllers.GetDirectMembers)
	}

	// User routes
	userRouter := r.Group("/users")
	{
		userRouter.GET("/", controllers.GetUsers)
		userRouter.GET("/:id/edit", controllers.EditUser)
		userRouter.PUT("/:id/update", controllers.UpdateUser)
		userRouter.DELETE("/:id/delete", controllers.DeleteUser)
		userRouter.GET("/all-trash", controllers.GetTrashedUsers)
		userRouter.DELETE("/delete-permanent/:id", controllers.PermanentlyDeleteUser)
	}

	// Category routes
	catRouter := r.Group("/categories")
	{
		catRouter.GET("/", controllers.GetCategories)
		catRouter.POST("/create", controllers.CreateCategory)
		catRouter.GET("/:id/edit", controllers.EditCategory)
		catRouter.PUT("/:id/update", controllers.UpdateCategory)
		catRouter.DELETE("/:id/delete", controllers.DeleteCategory)
		catRouter.GET("/all-trash", controllers.GetTrashCategories)
		catRouter.DELETE("/delete-permanent/:id", controllers.DeleteCategoryPermanent)
	}

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

	fmt.Println("✅ Partner routes registration complete!")
}
