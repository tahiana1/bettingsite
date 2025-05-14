package middleware

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

func LogAuth(c *gin.Context) {
	uaString := c.GetHeader("User-Agent")

	ua := helpers.ParseClient(uaString)
	fmt.Println(ua)

	l := &models.Log{}
	l.Method = c.Request.Method
	l.IP = c.ClientIP()
	l.Type = "R"
	l.Path = c.Request.URL.Path
	l.Device = ua.BrowserName + " " + ua.BrowserVersion
	l.OS = ua.OS
	l.Host = c.Request.Host
	bodyBytes, err := io.ReadAll(c.Request.Body)
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	l.Data = string(bodyBytes)
	sg := strings.Split(c.Request.Host, ":")

	if len(sg) > 0 {
		c.Set("accessDomain", sg[0])
	}

	if err != nil {
		l.Data = err.Error()
	}

	// Get the cookie from the request
	tokenString, err := c.Cookie("Authorization")
	t := c.GetHeader("Authorization")
	if tokenString == "" && t == "" {
		l.Status = "unauthorized"
		initializers.DB.Save(l)
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
		l.Status = "invalid_token"
		initializers.DB.Save(l)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check the expiration time
		// fmt.Println(c.ClientIP(), claims)
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.Next()
			l.Status = "token_expired"
			initializers.DB.Save(l)
			return
		}

		// Check the expiration time
		if c.ClientIP() != claims["ip"] {
			c.Next()
			l.Status = "invalid_ip"
			initializers.DB.Save(l)
			return
		}
		// Find the user with token sub
		var user models.User
		initializers.DB.Find(&user, claims["sub"])

		if user.ID == 0 {
			c.Next()
			l.Status = "user_not_found!"
			initializers.DB.Save(l)
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
		l.Status = "invalid_token"
		initializers.DB.Save(l)
		c.Next()
		return
	}
}
