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

func RequirePartnerAuth(c *gin.Context) {
	// Get the cookie from the request
	tokenString, err := c.Cookie("Authorization")
	t := c.GetHeader("Authorization")
	if tokenString == "" {
		tokenString = t
	}
	if err != nil {
		fmt.Println("❌ Auth Failed ")
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
	}

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
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			fmt.Println("❌ Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		}

		// Check the expiration time
		if c.ClientIP() != claims["ip"] {
			fmt.Println("❌ Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		}
		// Find the user with token sub
		var user models.User
		initializers.DB.Find(&user, claims["sub"])

		if user.ID == 0 {
			fmt.Println("❌ Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
			return
		}
		if user.Status != "A" {
			format_errors.ForbbidenError(c, fmt.Errorf("❌ Unauthorized"))
			return
		}

		// Check if user's OnlineStatus is manually set to false (admin forced logout)
		if !user.OnlineStatus {
			fmt.Println("❌ Auth Failed: User is offline (OnlineStatus = false)")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ You have been logged out by administrator"))
			return
		}

		if user.Role == "P" {
			// Update online status
			user.CurrentIP = c.ClientIP()
			user.OnlineStatus = true
			initializers.DB.Save(&user)
			
			// Attach the user to request
			c.Set("authUser", user)

			fmt.Println("✅ Partner Auth Passed!")

			// Continue
			c.Next()
		} else {
			fmt.Println("❌ Partner Auth Failed ")
			format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		}
	} else {
		fmt.Println("❌ Auth Failed ")
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
	}
}
