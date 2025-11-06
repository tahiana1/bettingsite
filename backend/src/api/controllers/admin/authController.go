package controllers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
	"golang.org/x/crypto/bcrypt"
)

// Signup function is used to create a user or signup a user
func SignUp(c *gin.Context) {
	// Get the name, userid and password from request
	var userInput struct {
		Name          string    `json:"name" binding:"required,min=2,max=50"`
		HolderName    string    `json:"holderName"`
		Userid        string    `json:"userid" binding:"required,min=6"`
		Password      string    `json:"password" binding:"required,min=6"`
		SecPassword   string    `json:"securityPassword" binding:"required,min=6"`
		USDTAddress   string    `json:"usdtAddress"`
		AccountNumber string    `json:"accountNumber"`
		Bank          string    `json:"bank"`
		Birthday      time.Time `json:"birthday"`
		Phone         string    `json:"phone"`
		Referral      string    `json:"referral"`
		Favorites     string    `json:"favorites"`
		OS            string    `json:"os"`          // Optional: OS from frontend
		Device        string    `json:"device"`      // Optional: Device from frontend
		FingerPrint   string    `json:"fingerPrint"` // Optional: FingerPrint from frontend
		Domain        string    `json:"domain" binding:"required"` // Domain from frontend
	}

	if err := c.ShouldBindJSON(&userInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			format_errors.BadRequestError(c, errs)
			return
		}
		format_errors.BadRequestError(c, err)
		return
	}

	// Userid unique validation
	if validations.IsUniqueValue("users", "userid", userInput.Userid) {
		format_errors.ConflictError(c, fmt.Errorf("The userid is already existed!"))
		return
	}

	// Validate domain exists in domain table
	var domain models.Domain
	if err := initializers.DB.Where("name = ? AND status = ?", userInput.Domain, true).First(&domain).Error; err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("The domain is not exist."))
		return
	}

	// Hash the password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(userInput.Password), 10)

	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("The userid is already existed!"))
		return
	}

	// Get client IP
	clientIP := c.ClientIP()

	// Parse OS and Device from User-Agent if not provided in request
	var osValue, deviceValue string
	if userInput.OS != "" {
		osValue = userInput.OS
	} else {
		// Parse from User-Agent
		uaString := c.GetHeader("User-Agent")
		if uaString != "" {
			ua := helpers.ParseClient(uaString)
			osValue = ua.OS
			if userInput.Device == "" {
				deviceValue = ua.BrowserName + " " + ua.BrowserVersion
				if ua.Platform != "" {
					deviceValue = ua.Platform + " - " + deviceValue
				}
			}
		}
	}

	if userInput.Device != "" {
		deviceValue = userInput.Device
	}

	user := models.User{
		Name:        userInput.Name,
		Userid:      userInput.Userid,
		Password:    string(hashPassword),
		SecPassword: userInput.SecPassword,
		USDTAddress: userInput.USDTAddress,
		IP:          clientIP,
		CurrentIP:   clientIP,
		DomainIDs:   []uint{domain.ID}, // Store the domain ID in user's domain array
	}

	// Set OS if we have a value
	if osValue != "" {
		user.OS = osValue
	}

	// Set Device if we have a value
	if deviceValue != "" {
		user.Device = deviceValue
	}

	// Set FingerPrint if provided
	if userInput.FingerPrint != "" {
		user.FingerPrint = userInput.FingerPrint
	}

	// Create the user
	result := initializers.DB.Create(&user)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Parse favorites string into integer array
	var favorites models.IntArray
	if userInput.Favorites != "" {
		favStrings := strings.Split(userInput.Favorites, ",")
		for _, favStr := range favStrings {
			favStr = strings.TrimSpace(favStr)
			if favStr != "" {
				if favInt, err := strconv.Atoi(favStr); err == nil {
					favorites = append(favorites, favInt)
				}
			}
		}
	}

	// Return the user
	//user.Password = ""
	profile := &models.Profile{
		UserID:        user.ID,
		Name:          userInput.Name,
		Nickname:      userInput.Name,
		BankName:      userInput.Bank,
		HolderName:    userInput.HolderName,
		AccountNumber: userInput.AccountNumber,
		Birthday:      userInput.Birthday,
		Phone:         userInput.Phone,
		Favorites:     favorites,
		Referral:      userInput.Referral,
	}

	pr := initializers.DB.Create(&profile)

	if err := pr.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// Login function is used to log in a user
func Login(c *gin.Context) {
	// Get the userid and password from the request
	var userInput struct {
		Userid      string `json:"userid" binding:"required"`
		Password    string `json:"password" binding:"required"`
		OS          string `json:"os"`          // Optional: OS from frontend
		Device      string `json:"device"`      // Optional: Device from frontend
		FingerPrint string `json:"fingerPrint"` // Optional: FingerPrint from frontend
		Domain      string `json:"domain" binding:"required"` // Domain from frontend
	}

	if c.ShouldBindJSON(&userInput) != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Failed to read data from request!"))
		return
	}

	// Validate domain exists in domain table
	var domain models.Domain
	if err := initializers.DB.Where("name = ? AND status = ?", userInput.Domain, true).First(&domain).Error; err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("The domain is not exist."))
		return
	}

	// Find the user by userid
	var user models.User
	initializers.DB.First(&user, "userid = ?", userInput.Userid)
	if user.ID == 0 {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid UserID!"))
		return
	}

	if user.Status != "A" {
		format_errors.ForbbidenError(c, fmt.Errorf("You are not allowed!"))
		return
	}

	if user.Role == "U" {
		format_errors.ForbbidenError(c, fmt.Errorf("Access denied!"))
		return
	}

	// Check if user has access to this domain
	// Empty DomainIDs array means access to all domains
	// Non-empty array means access only to specified domains
	if len(user.DomainIDs) > 0 {
		hasAccess := false
		for _, domainID := range user.DomainIDs {
			if domainID == domain.ID {
				hasAccess = true
				break
			}
		}
		if !hasAccess {
			format_errors.ForbbidenError(c, fmt.Errorf("You do not have access to this domain"))
			return
		}
	}
	// Compare the password with user hashed password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInput.Password))
	if err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	// Get client IP
	clientIP := c.ClientIP()

	// Parse OS and Device from User-Agent if not provided in request
	var osValue, deviceValue string
	if userInput.OS != "" {
		osValue = userInput.OS
	} else {
		// Parse from User-Agent
		uaString := c.GetHeader("User-Agent")
		if uaString != "" {
			ua := helpers.ParseClient(uaString)
			osValue = ua.OS
			if userInput.Device == "" {
				deviceValue = ua.BrowserName + " " + ua.BrowserVersion
				if ua.Platform != "" {
					deviceValue = ua.Platform + " - " + deviceValue
				}
			}
		}
	}

	if userInput.Device != "" {
		deviceValue = userInput.Device
	}

	// Update user information with login details
	user.IP = clientIP        // Update IP with current login IP
	user.CurrentIP = clientIP // Update CurrentIP
	user.OnlineStatus = true

	// Update OS if we have a value
	if osValue != "" {
		user.OS = osValue
	}

	// Update Device if we have a value
	if deviceValue != "" {
		user.Device = deviceValue
	}

	// Update FingerPrint if provided
	if userInput.FingerPrint != "" {
		user.FingerPrint = userInput.FingerPrint
	}

	// Generate a JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
		"ip":  clientIP,
	})

	// Sign in and get the complete encoded token as a string using the .env secret
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	// Set expiry time and send the token back
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)
	
	// Save user with updated information
	initializers.DB.Save(&user)
	
	c.JSON(http.StatusOK, responses.Status{
		Token:       tokenString,
		Data:        user,
		Description: "You logged in as Admin!",
		Message:     "Welcome!",
	})
}

// Logout function is used to log out a user
func Logout(c *gin.Context) {
	// Get the authenticated user before clearing the cookie
	user, err := helpers.GetGinAuthUser(c)
	if err == nil && user != nil {
		// Set user offline
		user.OnlineStatus = false
		initializers.DB.Save(&user)
	}

	// Clear the cookie
	c.SetCookie("Authorization", "", 0, "", "", false, true)

	c.JSON(http.StatusOK, responses.Status{
		Message: "Logout successful",
	})
}

func Me(c *gin.Context) {

	// Create a post
	user, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	if user != nil {

		// Generate a JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": user.ID,
			"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
			"ip":  c.ClientIP(),
		})

		// Sign in and get the complete encoded token as a string using the .env secret
		tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

		if err != nil {
			format_errors.BadRequestError(c, err)
			return
		}

		// Set expiry time and send the token back
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)
		c.JSON(http.StatusOK, responses.Status{
			Token: tokenString,
			Data:  user,
		})
	} else {
		format_errors.UnauthorizedError(c, fmt.Errorf("User Not Found!"))
		return
	}

}

func GetMyProfile(c *gin.Context) {

	// Create a post
	user, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}
	initializers.DB.Model(user).Preload("Profile").Find(user, "userid = ?", user.Userid)
	if user != nil {
		c.JSON(http.StatusOK, responses.Status{Data: user})
	} else {
		format_errors.UnauthorizedError(c, fmt.Errorf("User Not Found!"))
		return
	}

}

func UpdateMe(c *gin.Context) {

	// Create a post
	user, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	if user != nil {
		c.JSON(http.StatusOK, responses.Status{Data: user})
	} else {
		format_errors.UnauthorizedError(c, fmt.Errorf("User Not Found!"))
		return
	}

}
