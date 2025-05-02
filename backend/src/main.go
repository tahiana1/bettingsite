package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/controllers"
	"github.com/hotbrainy/go-betting/backend/api/router"
	"github.com/hotbrainy/go-betting/backend/config"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/fetcher"
	"github.com/hotbrainy/go-betting/backend/internal/kafka"
	"github.com/hotbrainy/go-betting/backend/internal/redis"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func init() {
	config.LoadEnvVariables()
	initializers.ConnectDB()
	kafka.InitKafka()
	redis.InitRedis()
	fetcher.StartPolling()
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

	h2s := &http2.Server{}

	server := &http.Server{
		Addr:    "0.0.0.0:" + port,
		Handler: h2c.NewHandler(r, h2s),
	}

	fmt.Printf("🔥 Server is running %s\n", server.Addr)

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("⛔ Server is not running because of " + err.Error())
	}

}
