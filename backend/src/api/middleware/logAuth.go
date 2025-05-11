package middleware

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

func LogAuth(c *gin.Context) {
	l := &models.Log{}
	l.IP = c.ClientIP()
	l.Type = "R"
	l.Path = c.Request.URL.Path
	bodyBytes, err := io.ReadAll(c.Request.Body)
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	l.Data = string(bodyBytes)
	if err != nil {
		l.Data = err.Error()
	}

	initializers.DB.Save(l)
	// Get the cookie from the request
	tokenString, err := c.Cookie("Authorization")
	t := c.GetHeader("Authorization")
	if tokenString == "" && t == "" {
		c.Next()
		return
	}

	tokenString = t
	// Decode and validate it
	// Parse and takes the token string and a function for look
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the alg
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		c.Next()
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check the expiration time
		// fmt.Println(c.ClientIP(), claims)
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.Next()
			return
		}

		// Check the expiration time
		if c.ClientIP() != claims["ip"] {
			c.Next()
			return
		}
		// Find the user with token sub
		var user models.User
		initializers.DB.Find(&user, claims["sub"])

		if user.ID == 0 {
			c.Next()
			return
		}

		// Attach the user to request
		c.Set("authUser", &user)

		fmt.Println("✅ Check Auth Passed!")

		l.UserID = &user.ID
		l.Status = "success"

		initializers.DB.Save(l)

		// Continue
		c.Next()
	} else {
		c.Next()
		return
	}
}
