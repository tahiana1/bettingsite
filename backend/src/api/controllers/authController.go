package controllers

import (
	"fmt"
	"net/http"
	"os"
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
		format_errors.ConflictError(c, fmt.Errorf("The userid is already exist!"))
		return
	}

	// Hash the password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(userInput.Password), 10)

	if err != nil {
		format_errors.ConflictError(c, err)
		return
	}

	user := models.User{
		Name:        userInput.Name,
		Userid:      userInput.Userid,
		Password:    string(hashPassword),
		SecPassword: userInput.SecPassword,
		USDTAddress: userInput.USDTAddress,
		IP:          c.ClientIP(),
		CurrentIP:   c.ClientIP(),
	}

	// Create the user
	result := initializers.DB.Create(&user)

	if err := result.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
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
		Favorites:     userInput.Favorites,
		Referral:      userInput.Referral,
	}

	pr := initializers.DB.Create(&profile)

	if err := pr.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, responses.Status{
		Data: user,
	})
}

// Login function is used to log in a user
func Login(c *gin.Context) {
	// Get the userid and password from the request
	var userInput struct {
		Userid   string `json:"userid" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	l := &models.Log{}
	l.IP = c.ClientIP()
	l.Type = "L"

	l.Path = c.Request.URL.Path

	if err := c.ShouldBindJSON(&userInput); err != nil {
		format_errors.BadRequestError(c, err)
		l.Data = err.Error()
		l.Status = "error"
		initializers.DB.Save(l)
		return
	}

	// Find the user by userid
	var user models.User
	initializers.DB.First(&user, "userid = ?", userInput.Userid).Preload("Profile")
	if user.ID == 0 {
		format_errors.NotFound(c, fmt.Errorf("Invalid UserID!"))
		l.Data = "Invalid UserID!"
		l.Status = "error"
		initializers.DB.Save(l)
		return
	}

	if user.Status != "A" {
		format_errors.ForbbidenError(c, fmt.Errorf("You are not allowed!"))
		l.Data = "You are not allowed!"
		l.Status = "error"
		initializers.DB.Save(l)
		return
	}

	// Compare the password with user hashed password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInput.Password))
	if err != nil {
		format_errors.UnauthorizedError(c, err)
		l.Data = err.Error()
		l.Status = "error"
		initializers.DB.Save(l)
		return
	}

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
		l.Data = err.Error()
		l.Status = "error"
		initializers.DB.Save(l)
		return
	}

	// Set expiry time and send the token back

	c.SetSameSite(http.SameSiteLaxMode)

	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

	user.CurrentIP = c.ClientIP()
	initializers.DB.Save(&user)
	l.Phone = user.Profile.Phone
	l.Status = "success"
	l.UserID = &user.ID
	l.Data = "Authorized!"
	initializers.DB.Save(l)
	fmt.Println("authorized")
	c.JSON(http.StatusOK, responses.Status{
		Token:   tokenString,
		Data:    user,
		Message: "Authorized!",
	})
}

// Logout function is used to log out a user
func Logout(c *gin.Context) {
	// Clear the cookie
	c.SetCookie("Authorization", "", 0, "", "", false, true)

	c.JSON(http.StatusOK, responses.Status{
		Message: "Logout successfully.",
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
		// Load profile data
		initializers.DB.Model(user).Preload("Profile").Find(user, "userid = ?", user.Userid)

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
			Token:   tokenString,
			Data:    user,
			Message: "Authorized!",
		})
	} else {
		format_errors.UnauthorizedError(c, fmt.Errorf("No user founded!"))
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
		c.JSON(http.StatusOK, responses.Status{
			Data:    user,
			Message: "Authorized!",
		})
	} else {
		format_errors.UnauthorizedError(c, fmt.Errorf("User Not Found!"))
		return
	}

}

func GetInfo(c *gin.Context) {
	today := time.Now().Truncate(24 * time.Hour)
	now := time.Now()

	// 1. Today's deposit amount (approved only)
	var depositToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ? AND DATE(transaction_at) = ?", "deposit", "A", today.Format("2006-01-02")).
		Select("COALESCE(SUM(amount),0)").
		Scan(&depositToday)

	// 2. Today's withdraw amount (approved only)
	var withdrawToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ? AND DATE(transaction_at) = ?", "withdrawal", "A", today.Format("2006-01-02")).
		Select("COALESCE(SUM(amount),0)").
		Scan(&withdrawToday)

	// 3. Total balance and points of all users
	var totalBalance float64
	var totalPoints int64
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(balance),0)").Scan(&totalBalance)
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(point),0)").Scan(&totalPoints)

	// 4. Count today's winners on bet (status = 'won' and settled today)
	var todayWinners int64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(settled_at) = ?", "won", today.Format("2006-01-02")).
		Count(&todayWinners)

	// 5. bettingToday: Total stake of all bets placed today, grouped by placed_at (so simultaneous bets are counted as one)
	var bettingToday float64
	initializers.DB.
		Table("(SELECT placed_at, MAX(stake) as stake FROM bets WHERE DATE(placed_at) = ? GROUP BY placed_at) as grouped_bets", today.Format("2006-01-02")).
		Select("COALESCE(SUM(stake),0)").
		Scan(&bettingToday)

	// 6. totalLoss: Total stake of lost bets settled today
	var totalLoss float64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(settled_at) = ?", "lost", today.Format("2006-01-02")).
		Select("COALESCE(SUM(stake),0)").
		Scan(&totalLoss)

	// 7. totalSalesLossToday: Alias for totalLoss
	totalSalesLossToday := totalLoss

	// 8. todaysDistributionRolling: Total stake of all bets placed today (or use a specific transaction type if you have one)
	todaysDistributionRolling := bettingToday

	// 9. sportsPendingBetting: Count of bets with status 'pending' placed today
	var sportsPendingBetting int64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(placed_at) = ?", "pending", today.Format("2006-01-02")).
		Count(&sportsPendingBetting)

	// 10. sportsRebateBetting: Placeholder (set to 0 or implement if you have logic)
	sportsRebateBetting := 0

	c.JSON(http.StatusOK, gin.H{
		"depositToday":              depositToday,
		"withdrawToday":             withdrawToday,
		"totalBalance":              totalBalance,
		"totalPoints":               totalPoints,
		"todayWinners":              todayWinners,
		"bettingToday":              bettingToday,
		"totalLoss":                 totalLoss,
		"totalSalesLossToday":       totalSalesLossToday,
		"todaysDistributionRolling": todaysDistributionRolling,
		"sportsPendingBetting":      sportsPendingBetting,
		"sportsRebateBetting":       sportsRebateBetting,
		"now":                       now,
	})
}

func UpdateMe(c *gin.Context) {

	// Create a post
	user, err := helpers.GetGinAuthUser(c)
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	if user != nil {
		c.JSON(http.StatusOK, responses.Status{
			Data:    user,
			Message: "Authorized!",
		})
	} else {
		format_errors.UnauthorizedError(c, fmt.Errorf("User Not Found!"))
		return
	}

}
