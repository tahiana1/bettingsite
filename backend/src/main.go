package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/hotbrainy/go-betting/backend/api/router"
	"github.com/hotbrainy/go-betting/backend/config"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func init() {
	config.LoadEnvVariables()
	initializers.ConnectDB()
}

func main() {
	r := gin.Default()
	r.GET("/ws", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}
		defer conn.Close()

		for {
			conn.WriteMessage(websocket.TextMessage, []byte(time.Now().String()))
			time.Sleep(1 * time.Second)
		}
	})
	router.GetRoute(r)

	r.Run("0.0.0.0:8080")
}
