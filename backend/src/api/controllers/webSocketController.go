package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/hotbrainy/go-betting/backend/internal/redis"
)

type Message struct {
	Sender string                 `json:"sender"`
	Data   map[string]interface{} `json:"data"`
}
type Client struct {
	ID   string
	Conn *websocket.Conn
}

var clients = make(map[string]*Client)
var clientsMu sync.RWMutex

var lock sync.Mutex

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Upgrade(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()
	channel := "info"
	rdb := redis.Client
	pubsub := rdb.Subscribe(c, channel)

	defer pubsub.Close()

	ch := pubsub.Channel()

	go func() {
		for msg := range ch {
			fmt.Println((msg.Payload))
			if err := conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
				log.Println(err)
				return
			}

			for _, client := range clients {
				if err := client.Conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
					log.Println(err)
					return
				}
			}
			// leaguesBytes, err := json.Marshal(leagues)
			// if err != nil {
			// 	log.Println(err)
			// 	return
			// }
			// if err := conn.WriteMessage(websocket.TextMessage, leaguesBytes); err != nil {
			// 	log.Println(err)
			// 	return
			// }
		}
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}

		var msgData Message

		err = json.Unmarshal(msg, &msgData)
		if err != nil {
			log.Println(err)
			// break
		}
		fmt.Println(msgData)
		rdb.Publish(c, channel, msg)
	}

	// for {
	// 	conn.WriteMessage(websocket.TextMessage, []byte(time.Now().String()))
	// 	time.Sleep(1 * time.Second)
	// }
}

func Info(c *gin.Context) {
	userID := c.Query("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing userId"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	client := &Client{ID: userID, Conn: conn}
	clientsMu.Lock()
	clients[userID] = client
	clientsMu.Unlock()

	defer func() {
		clientsMu.Lock()
		delete(clients, userID)
		clientsMu.Unlock()
		conn.Close()
	}()

	rdb := redis.Client
	// Subscribe to Redis channel for this user
	pubsub := rdb.Subscribe(c, "private:"+userID)
	defer pubsub.Close()

	// Redis to WebSocket
	go func() {
		ch := pubsub.Channel()
		for msg := range ch {
			clientsMu.RLock()
			if c, ok := clients[userID]; ok {
				c.Conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload))
			}
			clientsMu.RUnlock()
		}
	}()

	// Optional: echo message back or broadcast, etc.
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error from %s: %v", userID, err)
			break
		}
		log.Printf("Received from %s: %s", userID, msg)

		var msgData Message

		err = json.Unmarshal(msg, &msgData)
		if err != nil {
			log.Println(err)
			// break
		}
		fmt.Println(msgData.Data["info"], msgData.Sender)
		data, _ := json.Marshal(msgData.Data)
		rdb.Publish(c, "private:"+msgData.Sender, data)
	}
}

func Broadcast(msg []byte) {
	lock.Lock()
	defer lock.Unlock()

	for userID, client := range clients {
		if err := client.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Println(err)
			if err != nil {
				client.Conn.Close()
				delete(clients, userID)
			}
			return
		}
	}

}
