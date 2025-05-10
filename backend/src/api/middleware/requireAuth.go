package middleware

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

func RequireAuth(c *gin.Context) {
	// Get the cookie from the request
	tokenString, err := c.Cookie("Authorization")
	t := c.GetHeader("Authorization")
	if tokenString == "" && t == "" {
		fmt.Println("❌ Auth Failed ")
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	tokenString = t
	// Decode and validate it
	// Parse and takes the token string and a function for look
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the alg
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			fmt.Println("❌ Auth Failed ")
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		fmt.Println("❌ Auth Failed ")
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check the expiration time
		fmt.Println(c.ClientIP(), claims)
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			fmt.Println("❌ Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
			return
		}

		// Check the expiration time
		if c.ClientIP() != claims["ip"] {
			fmt.Println("❌ Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
			return
		}
		// Find the user with token sub
		var user models.User
		initializers.DB.Find(&user, claims["sub"])

		if user.ID == 0 {
			fmt.Println("❌ Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
			return
		}

		if user.Userid != "admin" {
			if user.Status != true {
				format_errors.ForbbidenError(c, fmt.Errorf("❌ Unauthorized"))

				return
			}
		}

		// Attach the user to request
		c.Set("authUser", &user)

		fmt.Println("✅ User Auth Passed!")
		// Continue
		c.Next()
	} else {
		fmt.Println("❌ Auth Failed ")
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}
}
