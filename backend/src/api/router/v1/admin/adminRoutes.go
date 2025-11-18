package router

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/hotbrainy/go-betting/backend/api/controllers/admin"
	"github.com/hotbrainy/go-betting/backend/api/middleware"
)

func GetAdminRoute(r *gin.RouterGroup) {

	// User routes
	authRouter := r.Group("/auth")
	{
		authRouter.POST("/signup", controllers.SignUp)
		authRouter.POST("/login", controllers.Login)

		authRouter.Use(middleware.RequireAdminAuth)
		authRouter.POST("/logout", controllers.Logout)
	}

	r.Use(middleware.RequireAdminAuth)
	userRouter := r.Group("/users")
	{
		userRouter.GET("/", controllers.GetUsers)
		userRouter.GET("/:id/edit", controllers.EditUser)
		userRouter.PUT("/:id/update", controllers.UpdateUser)
		userRouter.DELETE("/:id/delete", controllers.DeleteUser)
		userRouter.GET("/all-trash", controllers.GetTrashedUsers)
		userRouter.DELETE("/delete-permanent/:id", controllers.PermanentlyDeleteUser)
		userRouter.POST("/reset-coupons", controllers.ResetAllCoupons)
	}

	// Category routes
	catRouter := r.Group("/categories")
	{
		//catRouter.Use(middleware.RequireAuth)

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
	// commentRouter := r.Group("/posts/:id/comment")
	// {
	// 	commentRouter.POST("/store", controllers.CommentOnPost)
	// 	commentRouter.GET("/:comment_id/edit", controllers.EditComment)
	// 	commentRouter.PUT("/:comment_id/update", controllers.UpdateComment)
	// 	commentRouter.DELETE("/:comment_id/delete", controllers.DeleteComment)
	// }

	// Sport routes
	sportRouter := r.Group("/sports")
	{
		sportRouter.GET("/", controllers.GetSports)
		sportRouter.POST("/create", controllers.CreateSport)
		// leagueRouter.GET("/:id/show", controllers.ShowPost)
		// leagueRouter.GET(":id/edit", controllers.EditPost)
		// leagueRouter.PUT("/:id/update", controllers.UpdatePost)
		// leagueRouter.DELETE("/:id/delete", controllers.DeletePost)
		// leagueRouter.GET("/all-trash", controllers.GetTrashedPosts)
		// leagueRouter.DELETE("/delete-permanent/:id", controllers.PermanentlyDeletePost)
	}

	// League routes
	leagueRouter := r.Group("/leagues")
	{
		leagueRouter.GET("/", controllers.GetLeagues)
		leagueRouter.POST("/create", controllers.CreateLeague)
		// leagueRouter.GET("/:id/show", controllers.ShowPost)
		// leagueRouter.GET(":id/edit", controllers.EditPost)
		// leagueRouter.PUT("/:id/update", controllers.UpdatePost)
		// leagueRouter.DELETE("/:id/delete", controllers.DeletePost)
		// leagueRouter.GET("/all-trash", controllers.GetTrashedPosts)
		// leagueRouter.DELETE("/delete-permanent/:id", controllers.PermanentlyDeletePost)
	}

	dashboardRouter := r.Group("/dashboard")
	{
		dashboardRouter.GET("/get-data", controllers.GetDashboard)
	}

	pointRouter := r.Group("/point")
	{
		pointRouter.POST("/convert", controllers.ConvertPoint)
	}

	rollingRouter := r.Group("/rolling")
	{
		rollingRouter.POST("/convert", controllers.ConvertRolling)
	}

	basicInfoRouter := r.Group("/basic-information")
	{
		basicInfoRouter.GET("/:userid", controllers.GetBasicInformation)
		basicInfoRouter.PUT("/:userid/update", controllers.UpdateBasicInformation)
	}

	contactInfoRouter := r.Group("/contact-info")
	{
		contactInfoRouter.GET("/get", controllers.GetContactInfo)
		contactInfoRouter.POST("/update", controllers.UpdateContactInfo)
	}

	// Level routes
	levelRouter := r.Group("/levels")
	{
		levelRouter.GET("/", controllers.GetLevels)
		levelRouter.GET("/:id", controllers.GetLevel)
		levelRouter.PUT("/:id/update", controllers.UpdateLevel)
		levelRouter.POST("/bulk-update", controllers.BulkUpdateLevels)
	}

	// Surprise Bonus routes (separate group to avoid route conflicts)
	surpriseBonusRouter := r.Group("/surprise-bonuses")
	{
		surpriseBonusRouter.GET("/level/:levelId", controllers.GetSurpriseBonuses)
		surpriseBonusRouter.POST("/level/:levelId", controllers.CreateSurpriseBonus)
		surpriseBonusRouter.PUT("/:id", controllers.UpdateSurpriseBonus)
		surpriseBonusRouter.DELETE("/:id", controllers.DeleteSurpriseBonus)
	}

	// Charge Bonus Table Level routes
	chargeBonusTableRouter := r.Group("/charge-bonus-tables")
	{
		chargeBonusTableRouter.GET("/level/:levelId/charge/:chargeBonusNumber", controllers.GetChargeBonusTableLevels)
		chargeBonusTableRouter.GET("/:id", controllers.GetChargeBonusTableLevel)
		chargeBonusTableRouter.POST("/", controllers.CreateChargeBonusTableLevel)
		chargeBonusTableRouter.PUT("/:id", controllers.UpdateChargeBonusTableLevel)
		chargeBonusTableRouter.DELETE("/:id", controllers.DeleteChargeBonusTableLevel)
		chargeBonusTableRouter.POST("/upsert", controllers.UpsertChargeBonusTableLevel)
	}

	// Transaction routes
	transactionRouter := r.Group("/transaction")
	{
		transactionRouter.POST("/deposit", controllers.Deposit)
		transactionRouter.POST("/withdrawal", controllers.Withdrawal)
	}

	// Mini bet options admin routes
	miniRouter := r.Group("/mini")
	{
		// Mini bet options CRUD
		miniRouter.GET("/options", controllers.AdminGetMiniBetOptions)
		miniRouter.GET("/options/:id", controllers.AdminGetMiniBetOption)
		miniRouter.POST("/options", controllers.AdminCreateMiniBetOption)
		miniRouter.PUT("/options/:id", controllers.AdminUpdateMiniBetOption)
		miniRouter.DELETE("/options/:id", controllers.AdminDeleteMiniBetOption)
		miniRouter.PATCH("/options/:id/toggle", controllers.AdminToggleMiniBetOption)
		miniRouter.PUT("/options/bulk-update", controllers.AdminBulkUpdateMiniBetOptions)
		miniRouter.POST("/options/initialize-defaults", controllers.AdminInitializeDefaultMiniBetOptions)

		// Mini game configs
		miniRouter.GET("/configs", controllers.AdminGetMiniGameConfigs)
		miniRouter.PUT("/configs", controllers.AdminUpdateMiniGameConfig)
	}

	// Alert routes
	alertRouter := r.Group("/alerts")
	{
		alertRouter.GET("", controllers.GetAlerts)
		alertRouter.GET("/", controllers.GetAlerts)
		alertRouter.GET("/unread-count", controllers.GetUnreadAlertsCount)
		alertRouter.POST("/mark-read", controllers.MarkAlertAsRead)
		alertRouter.POST("/mark-all-read", controllers.MarkAllAlertsAsRead)
		alertRouter.DELETE("/delete", controllers.DeleteAlert)
	}
}
