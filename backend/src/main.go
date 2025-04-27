package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/router"
	"github.com/hotbrainy/go-betting/backend/config"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/redis"
)

func init() {
	config.LoadEnvVariables()
	initializers.ConnectDB()
	redis.InitRedis()
}

func main() {
	r := gin.Default()
	r.RedirectTrailingSlash = false
	r.SetTrustedProxies([]string{"127.0.0.1", "::1"})
	r.Use(cors.Default())

	r.Static("/resources", "./static")
	r.GET("/ws/info", controllers.Info)
	r.GET("/ws", controllers.Upgrade)
	router.GetAPIRoute(r)
	port := os.Getenv("PORT")
	r.Run("0.0.0.0:" + port)
}
