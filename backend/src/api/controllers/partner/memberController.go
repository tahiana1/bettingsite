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
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/honorlinkapi"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type DirectMemberResponse struct {
	ID              uint    `json:"id"`
	Userid          string  `json:"userid"`
	Nickname        string  `json:"nickname"`
	Depositor       string  `json:"depositor"`
	AmountHeld      float64 `json:"amountHeld"`      // balance from profile
	Point           int32   `json:"point"`           // point from profile
	RollingGold     float64 `json:"rollingGold"`     // roll from profile
	Deposit         float64 `json:"deposit"`         // Total approved deposits
	Withdrawal      float64 `json:"withdrawal"`      // Total approved withdrawals
	Bet             float64 `json:"bet"`            // Total bet amount
	Winner          float64 `json:"winner"`          // Total winner amount
	AccessDate      *time.Time `json:"accessDate"`   // updatedAt from user
	DateOfRegistration *time.Time `json:"dateOfRegistration"` // createdAt from user
	Status          string  `json:"status"`
	Type            string  `json:"type"`
}

// GetDirectMembers function is used to get direct members list for partner
func GetDirectMembers(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	perPageStr := c.DefaultQuery("perPage", "25")
	perPage, _ := strconv.Atoi(perPageStr)
	if perPage < 1 {
		perPage = 25
	}

	// Get filter parameters
	statusFilter := c.Query("status")
	typeFilter := c.Query("type")
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Build query for direct members (where parent_id = partner.ID)
	query := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID)

	// Apply status filter
	if statusFilter != "" {
		query = query.Where("status = ?", statusFilter)
	}

	// Apply type filter
	if typeFilter != "" {
		query = query.Where("type = ?", typeFilter)
	}

	// Apply date range filter (registration date)
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		query = query.Where("created_at <= ?", dateTo)
	}

	// Apply search filter (ID, nickname, account)
	// We'll filter after loading to avoid complex joins
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		var matchingUserIDs []uint
		initializers.DB.Model(&models.User{}).
			Select("users.id").
			Joins("LEFT JOIN profiles ON profiles.user_id = users.id").
			Where("parent_id = ?", partner.ID).
			Where(
				"LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ? OR LOWER(profiles.account_number) LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern,
			).
			Pluck("users.id", &matchingUserIDs)
		if len(matchingUserIDs) > 0 {
			query = query.Where("id IN ?", matchingUserIDs)
		} else {
			// No matches, return empty result
			query = query.Where("1 = 0")
		}
	}

	// Preload Profile after all filters
	query = query.Preload("Profile")

	// Get total count
	var total int64
	query.Model(&models.User{}).Count(&total)

	// Apply pagination
	offset := (page - 1) * perPage
	var users []models.User
	if err := query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&users).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build response with calculated fields
	members := make([]DirectMemberResponse, 0, len(users))
	for _, user := range users {
		member := DirectMemberResponse{
			ID:                user.ID,
			Userid:            user.Userid,
			Nickname:          user.Profile.Nickname,
			Depositor:         user.Profile.HolderName,
			AmountHeld:         user.Profile.Balance,
			Point:             user.Profile.Point,
			RollingGold:       user.Profile.Roll,
			Status:            user.Status,
			Type:              user.Type,
			AccessDate:        &user.UpdatedAt,
			DateOfRegistration: &user.CreatedAt,
		}

		// Calculate total approved deposits
		var totalDeposit float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "deposit", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalDeposit)
		member.Deposit = totalDeposit

		// Calculate total approved withdrawals
		var totalWithdrawal float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "withdrawal", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalWithdrawal)
		member.Withdrawal = totalWithdrawal

		// Calculate total bet amount (sum of stake)
		var totalBet float64
		initializers.DB.Model(&models.Bet{}).
			Where("user_id = ?", user.ID).
			Select("COALESCE(SUM(stake), 0)").
			Scan(&totalBet)
		member.Bet = totalBet

		// Calculate total winner amount (bets where result = 'win', sum of potentialPayout)
		var totalWinner float64
		initializers.DB.Model(&models.Bet{}).
			Where("user_id = ? AND result = ?", user.ID, "win").
			Select("COALESCE(SUM(potential_payout), 0)").
			Scan(&totalWinner)
		member.Winner = totalWinner

		members = append(members, member)
	}

	// Calculate totals for all members (with same filters, without pagination)
	var totalAmountHeld, totalPoint, totalRollingGold, totalDeposit, totalWithdrawal, totalBet, totalWinner float64
	var totalPointInt int32

	// Build query for totals with same filters
	totalQuery := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID)

	// Apply same filters
	if statusFilter != "" {
		totalQuery = totalQuery.Where("status = ?", statusFilter)
	}
	if typeFilter != "" {
		totalQuery = totalQuery.Where("type = ?", typeFilter)
	}
	if dateFrom != "" {
		totalQuery = totalQuery.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		totalQuery = totalQuery.Where("created_at <= ?", dateTo)
	}
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		var matchingUserIDs []uint
		initializers.DB.Model(&models.User{}).
			Select("users.id").
			Joins("LEFT JOIN profiles ON profiles.user_id = users.id").
			Where("parent_id = ?", partner.ID).
			Where(
				"LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ? OR LOWER(profiles.account_number) LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern,
			).
			Pluck("users.id", &matchingUserIDs)
		if len(matchingUserIDs) > 0 {
			totalQuery = totalQuery.Where("id IN ?", matchingUserIDs)
		} else {
			totalQuery = totalQuery.Where("1 = 0")
		}
	}

	// Get all direct members for totals (without pagination)
	var allUsers []models.User
	totalQuery.Preload("Profile").Find(&allUsers)

	for _, user := range allUsers {
		totalAmountHeld += user.Profile.Balance
		totalPointInt += user.Profile.Point
		totalRollingGold += user.Profile.Roll

		var deposit, withdrawal, bet, winner float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "deposit", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&deposit)
		totalDeposit += deposit

		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "withdrawal", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&withdrawal)
		totalWithdrawal += withdrawal

		initializers.DB.Model(&models.Bet{}).
			Where("user_id = ?", user.ID).
			Select("COALESCE(SUM(stake), 0)").
			Scan(&bet)
		totalBet += bet

		initializers.DB.Model(&models.Bet{}).
			Where("user_id = ? AND result = ?", user.ID, "win").
			Select("COALESCE(SUM(potential_payout), 0)").
			Scan(&winner)
		totalWinner += winner
	}
	totalPoint = float64(totalPointInt)

	// Create total row
	totalRow := DirectMemberResponse{
		Userid:          "-",
		Nickname:        "-",
		Depositor:       "-",
		AmountHeld:      totalAmountHeld,
		Point:           int32(totalPoint),
		RollingGold:     totalRollingGold,
		Deposit:         totalDeposit,
		Withdrawal:      totalWithdrawal,
		Bet:             totalBet,
		Winner:          totalWinner,
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    members,
		"total":   totalRow,
		"pagination": gin.H{
			"current_page": page,
			"from":         offset + 1,
			"to":           offset + len(members),
			"last_page":    (int(total) + perPage - 1) / perPage,
			"per_page":     perPage,
			"total":        total,
		},
	})
}

// RegisterDirectMember function is used to register a direct member by a partner
func RegisterDirectMember(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get the registration data from request
	var userInput struct {
		Name          string    `json:"name" binding:"required,min=2,max=50"`
		HolderName    string    `json:"holderName"`
		Userid        string    `json:"userId" binding:"required,min=6"`
		Password      string    `json:"password" binding:"required,min=6"`
		PasswordSpell string    `json:"passwordSpell" binding:"required,min=6"`
		SecPassword   string    `json:"securityPassword" binding:"required,min=3"`
		USDTAddress   string    `json:"usdtAddress"`
		AccountNumber string    `json:"account_number"`
		Bank          string    `json:"bank"`
		Birthday      time.Time `json:"birthday"`
		Phone         string    `json:"phone"`
		Referral      string    `json:"referral"`
		OS            string    `json:"os"`
		Device        string    `json:"device"`
		FingerPrint   string    `json:"fingerPrint"`
		Domain        string    `json:"domain" binding:"required"`
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

	// Hash the password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userInput.Password), bcrypt.DefaultCost)
	if err != nil {
		format_errors.InternalServerError(c, fmt.Errorf("Failed to hash password: %v", err))
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

	// Create the user with parent_id set to partner's ID
	user := models.User{
		Name:        userInput.Name,
		Userid:      userInput.Userid,
		Password:    string(hashedPassword),
		SecPassword: userInput.SecPassword,
		PasswordSpell: userInput.Password,
		USDTAddress: userInput.USDTAddress,
		IP:          clientIP,
		CurrentIP:   clientIP,
		Domain:      userInput.Domain,
		ParentID:    &partner.ID, // Set the partner as parent
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

	// Find the bank by name if provided
	var bankID uint
	if userInput.Bank != "" {
		// Normalize the bank name: trim and lowercase
		normalizedBankName := strings.TrimSpace(strings.ToLower(userInput.Bank))
		var bank models.Bank
		err := initializers.DB.Where("LOWER(name) = ?", normalizedBankName).First(&bank).Error
		if err != nil {
			// If not found, create a new bank with status=false
			if err.Error() == "record not found" || err == gorm.ErrRecordNotFound {
				bank = models.Bank{
					Name:     normalizedBankName,
					Status:   false,
					OrderNum: 1,
				}
				if err := initializers.DB.Create(&bank).Error; err != nil {
					format_errors.BadRequestError(c, fmt.Errorf("Failed to create new bank: %v", err))
					return
				}
				bankID = bank.ID
			} else {
				format_errors.BadRequestError(c, fmt.Errorf("Invalid bank name provided"))
				return
			}
		} else {
			bankID = bank.ID
		}
	}

	// Create the profile
	profile := &models.Profile{
		UserID:        user.ID,
		Name:          userInput.Name,
		Nickname:      userInput.Name,
		BankName:      userInput.Bank,
		BankID:        bankID,
		HolderName:    userInput.HolderName,
		AccountNumber: userInput.AccountNumber,
		Birthday:      userInput.Birthday,
		Phone:         userInput.Phone,
		Referral:      userInput.Referral,
	}

	pr := initializers.DB.Create(&profile)

	// Check profile creation error first before proceeding with Honorlink integration
	if err := pr.Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// checking the user status on the honorlink api, then if it is not exist, creating the honorlink user account.
	// if the user is exist, skip the creating the honorlink user account.
	userExists, err := honorlinkapi.CheckUserExists(userInput.Userid)
	if err != nil {
		// Log error but don't fail the signup process
		fmt.Printf("Error checking Honorlink user: %v\n", err)
	} else if !userExists {
		// User doesn't exist, create it
		if err := honorlinkapi.CreateUser(userInput.Userid); err != nil {
			// Log error but don't fail the signup process
			fmt.Printf("Error creating Honorlink user: %v\n", err)
		}
	}

	c.JSON(http.StatusOK, responses.Status{
		Data:    user,
		Message: "Direct member registered successfully!",
	})
}

