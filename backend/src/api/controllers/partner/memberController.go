package controllers

import (
	"fmt"
	"net/http"
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
	ID                 uint       `json:"id"`
	Userid             string     `json:"userid"`
	Nickname           string     `json:"nickname"`
	Depositor          string     `json:"depositor"`
	AmountHeld         float64    `json:"amountHeld"`         // balance from profile
	Point              int32      `json:"point"`              // point from profile
	RollingGold        float64    `json:"rollingGold"`        // roll from profile
	Deposit            float64    `json:"deposit"`            // Total approved deposits
	Withdrawal         float64    `json:"withdrawal"`         // Total approved withdrawals
	Bet                float64    `json:"bet"`                // Total bet amount
	Winner             float64    `json:"winner"`             // Total winner amount
	AccessDate         *time.Time `json:"accessDate"`         // updatedAt from user
	DateOfRegistration *time.Time `json:"dateOfRegistration"` // createdAt from user
	Status             string     `json:"status"`
	Type               string     `json:"type"`
}

type SubMemberResponse struct {
	ID                 uint       `json:"id"`
	Userid             string     `json:"userid"`
	Nickname           string     `json:"nickname"`
	Depositor          string     `json:"depositor"`
	AmountHeld         float64    `json:"amountHeld"`         // balance from profile
	Point              int32      `json:"point"`              // point from profile
	RollingGold        float64    `json:"rollingGold"`        // roll from profile
	Deposit            float64    `json:"deposit"`            // Total approved deposits
	Withdrawal         float64    `json:"withdrawal"`         // Total approved withdrawals
	Bet                float64    `json:"bet"`                // Total bet amount
	Winner             float64    `json:"winner"`             // Total winner amount
	LosingMoney        float64    `json:"losingMoney"`        // EntireLosing from user
	EntryAndExit       float64    `json:"entryAndExit"`       // deposit - withdrawal
	NumberOfDeposits   int64      `json:"numberOfDeposits"`   // Count of deposit transactions
	BeDang             float64    `json:"beDang"`             // EntireLosing (same as losing money)
	AccessDate         *time.Time `json:"accessDate"`         // updatedAt from user
	DateOfRegistration *time.Time `json:"dateOfRegistration"` // createdAt from user
	Status             string     `json:"status"`
	Type               string     `json:"type"`
	Role               string     `json:"role"`        // User role (U, P, etc.)
	HasReferral        bool       `json:"hasReferral"` // Whether user has referral link
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
			ID:                 user.ID,
			Userid:             user.Userid,
			Nickname:           user.Profile.Nickname,
			Depositor:          user.Profile.HolderName,
			AmountHeld:         user.Profile.Balance,
			Point:              user.Profile.Point,
			RollingGold:        user.Profile.Roll,
			Status:             user.Status,
			Type:               user.Type,
			AccessDate:         &user.UpdatedAt,
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
		Userid:      "-",
		Nickname:    "-",
		Depositor:   "-",
		AmountHeld:  totalAmountHeld,
		Point:       int32(totalPoint),
		RollingGold: totalRollingGold,
		Deposit:     totalDeposit,
		Withdrawal:  totalWithdrawal,
		Bet:         totalBet,
		Winner:      totalWinner,
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
		Name:          userInput.Name,
		Userid:        userInput.Userid,
		Password:      string(hashedPassword),
		SecPassword:   userInput.SecPassword,
		PasswordSpell: userInput.Password,
		USDTAddress:   userInput.USDTAddress,
		IP:            clientIP,
		CurrentIP:     clientIP,
		Domain:        userInput.Domain,
		ParentID:      &partner.ID, // Set the partner as parent
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

// GetSubMembers function is used to get sub members list for partner
func GetSubMembers(c *gin.Context) {
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
	memberTypeFilter := c.Query("memberType") // member, distributor, distributor+member
	referralFilter := c.Query("referral")     // entire, has, none
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Build query for sub members (where parent_id = partner.ID)
	query := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID)

	// Apply member type filter (role-based)
	switch memberTypeFilter {
	case "member":
		query = query.Where("role = ?", "U")
	case "distributor":
		query = query.Where("role = ?", "P")
	case "distributor+member":
		query = query.Where("role IN ?", []string{"U", "P"})
	}

	// Apply referral filter
	switch referralFilter {
	case "has":
		// Users with referral link (profile.referral is not empty)
		var usersWithReferral []uint
		initializers.DB.Model(&models.Profile{}).
			Where("referral IS NOT NULL AND referral != ''").
			Joins("JOIN users ON users.id = profiles.user_id").
			Where("users.parent_id = ?", partner.ID).
			Pluck("users.id", &usersWithReferral)
		if len(usersWithReferral) > 0 {
			query = query.Where("id IN ?", usersWithReferral)
		} else {
			query = query.Where("1 = 0")
		}
	case "none":
		// Users without referral link
		var usersWithoutReferral []uint
		initializers.DB.Model(&models.Profile{}).
			Where("(referral IS NULL OR referral = '')").
			Joins("JOIN users ON users.id = profiles.user_id").
			Where("users.parent_id = ?", partner.ID).
			Pluck("users.id", &usersWithoutReferral)
		if len(usersWithoutReferral) > 0 {
			query = query.Where("id IN ?", usersWithoutReferral)
		} else {
			query = query.Where("1 = 0")
		}
	}

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

	// Apply search filter (ID, nickname, account holder, phone)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		var matchingUserIDs []uint
		initializers.DB.Model(&models.User{}).
			Select("users.id").
			Joins("LEFT JOIN profiles ON profiles.user_id = users.id").
			Where("parent_id = ?", partner.ID).
			Where(
				"LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ? OR LOWER(profiles.phone) LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern,
			).
			Pluck("users.id", &matchingUserIDs)
		if len(matchingUserIDs) > 0 {
			query = query.Where("id IN ?", matchingUserIDs)
		} else {
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
	members := make([]SubMemberResponse, 0, len(users))
	for _, user := range users {
		member := SubMemberResponse{
			ID:                 user.ID,
			Userid:             user.Userid,
			Nickname:           user.Profile.Nickname,
			Depositor:          user.Profile.HolderName,
			AmountHeld:         user.Profile.Balance,
			Point:              user.Profile.Point,
			RollingGold:        user.Profile.Roll,
			Status:             user.Status,
			Type:               user.Type,
			Role:               user.Role,
			AccessDate:         &user.UpdatedAt,
			DateOfRegistration: &user.CreatedAt,
			LosingMoney:        user.EntireLosing,
			BeDang:             user.EntireLosing,
			HasReferral:        user.Profile.Referral != "",
		}

		// Calculate total approved deposits
		var totalDeposit float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "deposit", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalDeposit)
		member.Deposit = totalDeposit

		// Get count of deposits
		var depositCount int64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "deposit", "A").
			Count(&depositCount)
		member.NumberOfDeposits = depositCount

		// Calculate total approved withdrawals
		var totalWithdrawal float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "withdrawal", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalWithdrawal)
		member.Withdrawal = totalWithdrawal

		// Calculate entry and exit (deposit - withdrawal)
		member.EntryAndExit = totalDeposit - totalWithdrawal

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
	var totalAmountHeld, totalPoint, totalRollingGold, totalDeposit, totalWithdrawal, totalBet, totalWinner, totalLosingMoney, totalEntryAndExit, totalBeDang float64
	var totalPointInt int32
	var totalNumberOfDeposits int64

	// Build query for totals with same filters
	totalQuery := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID)

	// Apply same filters
	switch memberTypeFilter {
	case "member":
		totalQuery = totalQuery.Where("role = ?", "U")
	case "distributor":
		totalQuery = totalQuery.Where("role = ?", "P")
	case "distributor+member":
		totalQuery = totalQuery.Where("role IN ?", []string{"U", "P"})
	}

	switch referralFilter {
	case "has":
		var usersWithReferral []uint
		initializers.DB.Model(&models.Profile{}).
			Where("referral IS NOT NULL AND referral != ''").
			Joins("JOIN users ON users.id = profiles.user_id").
			Where("users.parent_id = ?", partner.ID).
			Pluck("users.id", &usersWithReferral)
		if len(usersWithReferral) > 0 {
			totalQuery = totalQuery.Where("id IN ?", usersWithReferral)
		} else {
			totalQuery = totalQuery.Where("1 = 0")
		}
	case "none":
		var usersWithoutReferral []uint
		initializers.DB.Model(&models.Profile{}).
			Where("(referral IS NULL OR referral = '')").
			Joins("JOIN users ON users.id = profiles.user_id").
			Where("users.parent_id = ?", partner.ID).
			Pluck("users.id", &usersWithoutReferral)
		if len(usersWithoutReferral) > 0 {
			totalQuery = totalQuery.Where("id IN ?", usersWithoutReferral)
		} else {
			totalQuery = totalQuery.Where("1 = 0")
		}
	}

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
				"LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ? OR LOWER(profiles.phone) LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern,
			).
			Pluck("users.id", &matchingUserIDs)
		if len(matchingUserIDs) > 0 {
			totalQuery = totalQuery.Where("id IN ?", matchingUserIDs)
		} else {
			totalQuery = totalQuery.Where("1 = 0")
		}
	}

	// Get all sub members for totals (without pagination)
	var allUsers []models.User
	totalQuery.Preload("Profile").Find(&allUsers)

	for _, user := range allUsers {
		totalAmountHeld += user.Profile.Balance
		totalPointInt += user.Profile.Point
		totalRollingGold += user.Profile.Roll
		totalLosingMoney += user.EntireLosing
		totalBeDang += user.EntireLosing

		var deposit, withdrawal, bet, winner float64
		var depositCount int64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "deposit", "A").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&deposit)
		totalDeposit += deposit

		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND status = ?", user.ID, "deposit", "A").
			Count(&depositCount)
		totalNumberOfDeposits += depositCount

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
	totalEntryAndExit = totalDeposit - totalWithdrawal

	// Create total row
	totalRow := SubMemberResponse{
		Userid:           "-",
		Nickname:         "-",
		Depositor:        "-",
		AmountHeld:       totalAmountHeld,
		Point:            int32(totalPoint),
		RollingGold:      totalRollingGold,
		Deposit:          totalDeposit,
		Withdrawal:       totalWithdrawal,
		Bet:              totalBet,
		Winner:           totalWinner,
		LosingMoney:      totalLosingMoney,
		EntryAndExit:     totalEntryAndExit,
		NumberOfDeposits: totalNumberOfDeposits,
		BeDang:           totalBeDang,
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

type SubDistributorResponse struct {
	ID              uint                     `json:"id"`
	Userid          string                   `json:"userid"`
	Nickname        string                   `json:"nickname"`
	NumberOfMembers int64                    `json:"numberOfMembers"`
	Status          string                   `json:"status"`
	AmountHeld      float64                  `json:"amountHeld"`
	Point           int32                    `json:"point"`
	SettlementType  string                   `json:"settlementType"`
	RollingRate     string                   `json:"rollingRate"` // Format: "0/0/0/0/0/0/0/0/0/0"
	RollingToday    float64                  `json:"rollingToday"`
	LosingRate      string                   `json:"losingRate"` // Format: "0/0/0/0/0/0/0/0/0/0"
	LosingToday     float64                  `json:"losingToday"`
	SubDistributors []SubDistributorResponse `json:"subDistributors,omitempty"`
}

// GetSubDistributors function is used to get sub-distributors list for partner
func GetSubDistributors(c *gin.Context) {
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

	// Get filter parameters
	statusFilter := c.Query("status")
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")
	onlyDirectMembers := c.Query("onlyDirectMembers") == "true"

	// Get pagination parameters (optional, for future use)
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	perPageStr := c.DefaultQuery("perPage", "50")
	perPage, _ := strconv.Atoi(perPageStr)
	if perPage < 1 {
		perPage = 50
	}

	// Build query for sub-distributors (where parent_id = partner.ID)
	// Show all users with parent_id = partner.ID (they are all sub-users of this partner)
	query := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID)

	// Apply status filter
	if statusFilter != "" {
		query = query.Where("status = ?", statusFilter)
	}

	// Apply date range filter (registration date)
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo to include the entire day
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else {
			query = query.Where("created_at <= ?", dateTo)
		}
	}

	// Apply search filter (ID, nickname, account holder, phone)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		var matchingUserIDs []uint
		initializers.DB.Model(&models.User{}).
			Select("users.id").
			Joins("LEFT JOIN profiles ON profiles.user_id = users.id").
			Where("parent_id = ?", partner.ID).
			Where(
				"LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ? OR LOWER(profiles.phone) LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern,
			).
			Pluck("users.id", &matchingUserIDs)
		if len(matchingUserIDs) > 0 {
			query = query.Where("id IN ?", matchingUserIDs)
		} else {
			query = query.Where("1 = 0")
		}
	}

	// Preload Profile - ensure it's loaded
	query = query.Preload("Profile")

	// Get total count before pagination
	var totalCount int64
	query.Model(&models.User{}).Count(&totalCount)

	// Get all sub-distributors (no pagination for now, as we need nested structure)
	// Note: Pagination is handled on frontend after flattening nested structure
	var distributors []models.User
	if err := query.Order("created_at DESC").Find(&distributors).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Debug: Log the count of distributors found
	fmt.Printf("🔍 Found %d sub-distributors for partner ID: %d (total in DB: %d)\n", len(distributors), partner.ID, totalCount)

	// Build response with nested structure
	distributorsResponse := make([]SubDistributorResponse, 0, len(distributors))
	today := time.Now().Format("2006-01-02")

	for _, distributor := range distributors {
		// Check if Profile is loaded
		if distributor.Profile.ID == 0 {
			fmt.Printf("⚠️ Warning: Profile not loaded for distributor ID: %d, Userid: %s\n", distributor.ID, distributor.Userid)
			// Try to load profile if not loaded
			initializers.DB.Model(&distributor).Preload("Profile").First(&distributor)
		}

		// Count number of members (direct children)
		var numberOfMembers int64
		memberQuery := initializers.DB.Model(&models.User{}).
			Where("parent_id = ?", distributor.ID)

		if onlyDirectMembers {
			// Only count direct members, not sub-distributors
			memberQuery = memberQuery.Where("role = ?", "U")
		}

		memberQuery.Count(&numberOfMembers)

		// Get settlement type - default value
		settlementType := "(Be-Dang)*Rate%-Rolling-Rolling Conversion"

		// Calculate rolling rates (10 game types)
		rollingRates := []float64{
			distributor.Live,
			distributor.Slot,
			distributor.Hold,
			distributor.MiniDanpolRolling,
			distributor.MiniCombinationRolling,
			distributor.SportsDanpolRolling,
			distributor.SportsDupolRolling,
			distributor.Sports3PoleRolling,
			distributor.Sports4PoleRolling,
		}
		rollingRateStr := ""
		for i, rate := range rollingRates {
			if i > 0 {
				rollingRateStr += "/"
			}
			rollingRateStr += fmt.Sprintf("%.0f", rate)
		}

		// Calculate losing rates (10 game types)
		losingRates := []float64{
			distributor.EntireLosing,
			distributor.LiveLosingBeDang,
			distributor.SlotLosingBeDang,
			distributor.HoldLosingBeDang,
			0, // Mini danpol losing
			0, // Mini combination losing
			0, // Sports danpol losing
			0, // Sports dupol losing
			0, // Sports 3pole losing
			0, // Sports 4pole losing
		}
		losingRateStr := ""
		for i, rate := range losingRates {
			if i > 0 {
				losingRateStr += "/"
			}
			losingRateStr += fmt.Sprintf("%.0f", rate)
		}

		// Calculate rolling today (transactions with type "Rolling" for today)
		var rollingToday float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ? AND DATE(created_at) = ?", distributor.ID, "Rolling", today).
			Select("COALESCE(ABS(SUM(amount)),0)").
			Scan(&rollingToday)

		// Calculate losing today (lost bets settled today)
		var losingToday float64
		initializers.DB.Model(&models.Bet{}).
			Where("user_id = ? AND status = ? AND DATE(settled_at) = ?", distributor.ID, "lost", today).
			Select("COALESCE(SUM(stake),0)").
			Scan(&losingToday)

		// Ensure Profile is loaded
		nickname := ""
		balance := 0.0
		point := int32(0)
		if distributor.Profile.ID != 0 {
			nickname = distributor.Profile.Nickname
			balance = distributor.Profile.Balance
			point = distributor.Profile.Point
		} else {
			fmt.Printf("⚠️ Profile missing for user ID: %d, attempting to load...\n", distributor.ID)
			var profile models.Profile
			if err := initializers.DB.Where("user_id = ?", distributor.ID).First(&profile).Error; err == nil {
				nickname = profile.Nickname
				balance = profile.Balance
				point = profile.Point
			}
		}

		distributorResp := SubDistributorResponse{
			ID:              distributor.ID,
			Userid:          distributor.Userid,
			Nickname:        nickname,
			NumberOfMembers: numberOfMembers,
			Status:          distributor.Status,
			AmountHeld:      balance,
			Point:           point,
			SettlementType:  settlementType,
			RollingRate:     rollingRateStr,
			RollingToday:    rollingToday,
			LosingRate:      losingRateStr,
			LosingToday:     losingToday,
		}

		// Get sub-distributors (nested) - show all users with parent_id = distributor.ID
		if !onlyDirectMembers {
			var subDistributors []models.User
			subQuery := initializers.DB.Model(&models.User{}).
				Where("parent_id = ?", distributor.ID).
				Preload("Profile")

			if statusFilter != "" {
				subQuery = subQuery.Where("status = ?", statusFilter)
			}

			subQuery.Order("created_at DESC").Find(&subDistributors)

			subDistributorsResp := make([]SubDistributorResponse, 0, len(subDistributors))
			for _, subDist := range subDistributors {
				var subNumberOfMembers int64
				initializers.DB.Model(&models.User{}).
					Where("parent_id = ?", subDist.ID).
					Count(&subNumberOfMembers)

				subSettlementType := "(Be-Dang)*Rate%-Rolling-Rolling Conversion"

				subRollingRates := []float64{
					subDist.Live,
					subDist.Slot,
					subDist.Hold,
					subDist.MiniDanpolRolling,
					subDist.MiniCombinationRolling,
					subDist.SportsDanpolRolling,
					subDist.SportsDupolRolling,
					subDist.Sports3PoleRolling,
					subDist.Sports4PoleRolling,
				}
				subRollingRateStr := ""
				for i, rate := range subRollingRates {
					if i > 0 {
						subRollingRateStr += "/"
					}
					subRollingRateStr += fmt.Sprintf("%.0f", rate)
				}

				subLosingRates := []float64{
					subDist.EntireLosing,
					subDist.LiveLosingBeDang,
					subDist.SlotLosingBeDang,
					subDist.HoldLosingBeDang,
					0, 0, 0, 0, 0, 0,
				}
				subLosingRateStr := ""
				for i, rate := range subLosingRates {
					if i > 0 {
						subLosingRateStr += "/"
					}
					subLosingRateStr += fmt.Sprintf("%.0f", rate)
				}

				var subRollingToday float64
				initializers.DB.Model(&models.Transaction{}).
					Where("user_id = ? AND type = ? AND DATE(created_at) = ?", subDist.ID, "Rolling", today).
					Select("COALESCE(ABS(SUM(amount)),0)").
					Scan(&subRollingToday)

				var subLosingToday float64
				initializers.DB.Model(&models.Bet{}).
					Where("user_id = ? AND status = ? AND DATE(settled_at) = ?", subDist.ID, "lost", today).
					Select("COALESCE(SUM(stake),0)").
					Scan(&subLosingToday)

				// Ensure Profile is loaded for sub-distributor
				subNickname := ""
				subBalance := 0.0
				subPoint := int32(0)
				if subDist.Profile.ID != 0 {
					subNickname = subDist.Profile.Nickname
					subBalance = subDist.Profile.Balance
					subPoint = subDist.Profile.Point
				} else {
					var subProfile models.Profile
					if err := initializers.DB.Where("user_id = ?", subDist.ID).First(&subProfile).Error; err == nil {
						subNickname = subProfile.Nickname
						subBalance = subProfile.Balance
						subPoint = subProfile.Point
					}
				}

				subDistributorsResp = append(subDistributorsResp, SubDistributorResponse{
					ID:              subDist.ID,
					Userid:          subDist.Userid,
					Nickname:        subNickname,
					NumberOfMembers: subNumberOfMembers,
					Status:          subDist.Status,
					AmountHeld:      subBalance,
					Point:           subPoint,
					SettlementType:  subSettlementType,
					RollingRate:     subRollingRateStr,
					RollingToday:    subRollingToday,
					LosingRate:      subLosingRateStr,
					LosingToday:     subLosingToday,
				})
			}
			distributorResp.SubDistributors = subDistributorsResp
		}

		distributorsResponse = append(distributorsResponse, distributorResp)
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    distributorsResponse,
		"pagination": gin.H{
			"total":        totalCount,
			"current_page": page,
			"per_page":     perPage,
		},
	})
}

type ConnectedMemberResponse struct {
	ID                 uint       `json:"id"`
	Userid             string     `json:"userid"`
	Nickname           string     `json:"nickname"`
	Depositor          string     `json:"depositor"`
	AmountHeld         float64    `json:"amountHeld"`         // balance from profile
	Point              int32      `json:"point"`              // point from profile
	RollingGold        float64    `json:"rollingGold"`        // roll from profile
	Deposit            float64    `json:"deposit"`            // Total approved deposits
	Withdrawal         float64    `json:"withdrawal"`         // Total approved withdrawals
	EntryAndExit       float64    `json:"entryAndExit"`       // deposit - withdrawal
	Bet                float64    `json:"bet"`                // Total bet amount
	Winner             float64    `json:"winner"`             // Total winner amount
	BeDang             float64    `json:"beDang"`             // EntireLosing
	ConnectionGame     string     `json:"connectionGame"`     // Placeholder for game info
	AccessDomain       string     `json:"accessDomain"`       // Domain from user
	ConnectionIP       string     `json:"connectionIP"`       // CurrentIP from user
	AccessDate         *time.Time `json:"accessDate"`         // updatedAt from user
	DateOfRegistration *time.Time `json:"dateOfRegistration"` // createdAt from user
	OnlineStatus       bool       `json:"onlineStatus"`       // Online status of the member
}

// GetConnectedMembers function is used to get all members list for partner (where parent_id = partner.ID)
func GetConnectedMembers(c *gin.Context) {
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

	// Get search query
	searchQuery := c.Query("search")
	// Get online status filter (optional: "true", "false", or empty for all)
	onlineStatusFilter := c.Query("onlineStatus")

	// Build query for all members (where parent_id = partner.ID)
	query := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID)

	// Apply online status filter if provided
	if onlineStatusFilter != "" {
		onlineStatusBool := onlineStatusFilter == "true" || onlineStatusFilter == "1"
		query = query.Where("online_status = ?", onlineStatusBool)
	}

	// Apply search filter (ID, nickname, account holder, phone)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		var matchingUserIDs []uint
		searchQueryBuilder := initializers.DB.Model(&models.User{}).
			Select("users.id").
			Joins("LEFT JOIN profiles ON profiles.user_id = users.id").
			Where("parent_id = ?", partner.ID)

		// Apply online status filter to search query if provided
		if onlineStatusFilter != "" {
			onlineStatusBool := onlineStatusFilter == "true" || onlineStatusFilter == "1"
			searchQueryBuilder = searchQueryBuilder.Where("users.online_status = ?", onlineStatusBool)
		}

		searchQueryBuilder.Where(
			"LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ? OR LOWER(profiles.account_number) LIKE ?",
			searchPattern, searchPattern, searchPattern, searchPattern,
		).Pluck("users.id", &matchingUserIDs)

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
	if err := query.Offset(offset).Limit(perPage).Order("updated_at DESC").Find(&users).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build response with calculated fields
	members := make([]ConnectedMemberResponse, 0, len(users))
	for _, user := range users {
		member := ConnectedMemberResponse{
			ID:                 user.ID,
			Userid:             user.Userid,
			Nickname:           user.Profile.Nickname,
			Depositor:          user.Profile.HolderName,
			AmountHeld:         user.Profile.Balance,
			Point:              user.Profile.Point,
			RollingGold:        user.Profile.Roll,
			AccessDomain:       user.Domain,
			ConnectionIP:       user.CurrentIP,
			AccessDate:         &user.UpdatedAt,
			DateOfRegistration: &user.CreatedAt,
			OnlineStatus:       user.OnlineStatus,
			ConnectionGame:     "-", // Placeholder - can be enhanced later with actual game tracking
			BeDang:             user.EntireLosing,
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

		// Calculate entry and exit (deposit - withdrawal)
		member.EntryAndExit = totalDeposit - totalWithdrawal

		// Calculate total bet amount (from transactions where type = "bet")
		var totalBet float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ?", user.ID, "bet").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalBet)
		member.Bet = totalBet

		// Calculate total winner amount (from transactions where type = "win")
		var totalWinner float64
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ? AND type = ?", user.ID, "win").
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalWinner)
		member.Winner = totalWinner

		members = append(members, member)
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    members,
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

type WaitingForMemberApprovalResponse struct {
	ID                 uint       `json:"id"`
	Userid             string     `json:"userid"`
	Nickname           string     `json:"nickname"`
	SignUpPath         string     `json:"signUpPath"`         // Domain from user
	SubscriptionIP     string     `json:"subscriptionIP"`     // IP from user (signup IP)
	RegistrationDomain string     `json:"registrationDomain"` // Domain from user
	DateOfRegistration *time.Time `json:"dateOfRegistration"` // createdAt from user
}

// GetWaitingForMemberApproval function is used to get pending members waiting for approval
func GetWaitingForMemberApproval(c *gin.Context) {
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
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")
	memberStatusFilter := c.Query("memberStatus") // "pending" or "today"

	// Build query for pending members (where parent_id = partner.ID and status = "P")
	query := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID).
		Where("status = ?", "P")

	// Apply member status filter
	if memberStatusFilter == "today" {
		// Filter by pending users created today
		today := time.Now()
		startOfDay := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())
		endOfDay := startOfDay.Add(24*time.Hour - time.Second)
		query = query.Where("created_at >= ? AND created_at <= ?", startOfDay, endOfDay)
	}

	// Apply date range filter (registration date)
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo to include the entire day
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else {
			query = query.Where("created_at <= ?", dateTo)
		}
	}

	// Apply search filter (ID, nickname, account)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		var matchingUserIDs []uint
		initializers.DB.Model(&models.User{}).
			Select("users.id").
			Joins("LEFT JOIN profiles ON profiles.user_id = users.id").
			Where("parent_id = ?", partner.ID).
			Where("status = ?", "P").
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

	// Build response
	members := make([]WaitingForMemberApprovalResponse, 0, len(users))
	for _, user := range users {
		member := WaitingForMemberApprovalResponse{
			ID:                 user.ID,
			Userid:             user.Userid,
			Nickname:           user.Profile.Nickname,
			SignUpPath:         user.Domain,
			SubscriptionIP:     user.IP,
			RegistrationDomain: user.Domain,
			DateOfRegistration: &user.CreatedAt,
		}
		members = append(members, member)
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    members,
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

type DirectMemberDepositWithdrawalResponse struct {
	ID            uint    `json:"id"`
	UserID        uint    `json:"userId"`
	Userid        string  `json:"userid"`
	Nickname      string  `json:"nickname"`
	Type          string  `json:"type"`
	Amount        float64 `json:"amount"`
	BalanceBefore float64 `json:"balanceBefore"`
	BalanceAfter  float64 `json:"balanceAfter"`
	Status        string  `json:"status"`
	TransactionAt string  `json:"transactionAt"`
	ApprovedAt    string  `json:"approvedAt,omitempty"`
	CreatedAt     string  `json:"createdAt"`
}

// GetDirectMemberDepositWithdrawal function is used to get deposit and withdrawal transactions for direct members (where parent_id = partner.ID)
func GetDirectMemberDepositWithdrawal(c *gin.Context) {
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
	typeFilter := c.Query("type") // "entire", "deposit", "withdrawal"
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Get sub-user IDs (where parent_id = partner.ID)
	var subUserIDs []uint
	if err := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID).
		Pluck("id", &subUserIDs).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// If no sub-users, return empty result
	if len(subUserIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []DirectMemberDepositWithdrawalResponse{},
			"pagination": gin.H{
				"current_page": page,
				"from":         0,
				"to":           0,
				"last_page":    0,
				"per_page":     perPage,
				"total":        0,
			},
		})
		return
	}

	// Build query for transactions where user_id IN subUserIDs and type IN ('deposit', 'withdrawal')
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ?", subUserIDs).
		Where("type IN ?", []string{"deposit", "withdrawal"}).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, user_id, nickname, phone")
			})
		})

	// Apply type filter if provided (and not "entire")
	if typeFilter != "" && typeFilter != "entire" {
		query = query.Where("type = ?", typeFilter)
	}

	// Apply date range filter
	if dateFrom != "" {
		// Try parsing with time first, then without
		if dateFromTime, err := time.Parse("2006-01-02 15:04", dateFrom); err == nil {
			query = query.Where("created_at >= ?", dateFromTime)
		} else if dateFromTime, err := time.Parse("2006-01-02", dateFrom); err == nil {
			query = query.Where("created_at >= ?", dateFromTime)
		} else {
			query = query.Where("created_at >= ?", dateFrom)
		}
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02 15:04", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else {
			query = query.Where("created_at <= ?", dateTo)
		}
	}

	// Apply search filter (ID, nickname, userid)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		query = query.Where(
			"LOWER(CAST(transactions.id AS TEXT)) LIKE ? OR EXISTS (SELECT 1 FROM users JOIN profiles ON profiles.user_id = users.id WHERE users.id = transactions.user_id AND (LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ?))",
			searchPattern, searchPattern, searchPattern,
		)
	}

	// Get total count before pagination
	var total int64
	query.Model(&models.Transaction{}).Count(&total)

	// Apply pagination and ordering
	offset := (page - 1) * perPage
	var transactions []models.Transaction
	if err := query.
		Offset(offset).
		Limit(perPage).
		Order("created_at DESC").
		Find(&transactions).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build response
	responseData := make([]DirectMemberDepositWithdrawalResponse, len(transactions))
	for i, t := range transactions {
		nickname := ""
		// Check if profile exists and has nickname
		if t.User.Profile.ID != 0 || t.User.Profile.UserID == t.UserID {
			nickname = t.User.Profile.Nickname
		}

		responseData[i] = DirectMemberDepositWithdrawalResponse{
			ID:            t.ID,
			UserID:        t.UserID,
			Userid:        t.User.Userid,
			Nickname:      nickname,
			Type:          t.Type,
			Amount:        t.Amount,
			BalanceBefore: t.BalanceBefore,
			BalanceAfter:  t.BalanceAfter,
			Status:        t.Status,
			TransactionAt: t.TransactionAt.Format(time.RFC3339),
			CreatedAt:     t.CreatedAt.Format(time.RFC3339),
		}

		// Set ApprovedAt if not zero
		if !t.ApprovedAt.IsZero() {
			responseData[i].ApprovedAt = t.ApprovedAt.Format(time.RFC3339)
		}
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    responseData,
		"pagination": gin.H{
			"current_page": page,
			"from":         offset + 1,
			"to":           offset + len(transactions),
			"last_page":    (int(total) + perPage - 1) / perPage,
			"per_page":     perPage,
			"total":        total,
		},
	})
}

// GetDirectMemberPointsDetails returns point-related transactions (point and pointDeposit) for direct members (where parent_id = partner.ID)
func GetDirectMemberPointsDetails(c *gin.Context) {
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

	perPageStr := c.DefaultQuery("perPage", "10")
	perPage, _ := strconv.Atoi(perPageStr)
	if perPage < 1 {
		perPage = 10
	}

	// Get filter parameters
	typeFilter := c.Query("type") // "entire" or a specific transaction type/explanation
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Get sub-user IDs (where parent_id = partner.ID)
	var subUserIDs []uint
	if err := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID).
		Pluck("id", &subUserIDs).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// If no sub-users, return empty result
	if len(subUserIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []interface{}{},
			"pagination": gin.H{
				"current_page": page,
				"from":         0,
				"to":           0,
				"last_page":    0,
				"per_page":     perPage,
				"total":        0,
			},
		})
		return
	}

	// Base query: sub-users' transactions limited to point and pointDeposit types
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ?", subUserIDs).
		Where("type IN ?", []string{"point", "pointDeposit"}).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("user_id, balance, point, nickname, phone, level")
			})
		})

	// Apply type filter if provided (and not "entire")
	// This can filter by transaction type or by explanation text
	if typeFilter != "" && typeFilter != "entire" {
		// Check if it's a transaction type first
		if typeFilter == "point" || typeFilter == "pointDeposit" {
			query = query.Where("type = ?", typeFilter)
		} else {
			// Otherwise, filter by explanation (for subtypes like "Recharge Bonus", "Point Conversion", etc.)
			query = query.Where("LOWER(explation) LIKE ?", "%"+strings.ToLower(typeFilter)+"%")
		}
	}

	// Apply date range filter
	if dateFrom != "" {
		// Try parsing with time first, then without
		if dateFromTime, err := time.Parse("2006-01-02 15:04", dateFrom); err == nil {
			query = query.Where("created_at >= ?", dateFromTime)
		} else if dateFromTime, err := time.Parse("2006-01-02", dateFrom); err == nil {
			query = query.Where("created_at >= ?", dateFromTime)
		} else {
			query = query.Where("created_at >= ?", dateFrom)
		}
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02 15:04", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else {
			query = query.Where("created_at <= ?", dateTo)
		}
	}

	// Apply search filter (nickname, phone, transaction ID, userid)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		query = query.Where(
			"LOWER(CAST(id AS TEXT)) LIKE ? OR EXISTS (SELECT 1 FROM users JOIN profiles ON profiles.user_id = users.id WHERE users.id = transactions.user_id AND (LOWER(users.userid) LIKE ? OR LOWER(users.name) LIKE ? OR LOWER(profiles.phone) LIKE ? OR LOWER(profiles.nickname) LIKE ?))",
			searchPattern, searchPattern, searchPattern, searchPattern, searchPattern,
		)
	}

	// Get total count before pagination
	var total int64
	query.Model(&models.Transaction{}).Count(&total)

	// Apply pagination and ordering
	offset := (page - 1) * perPage
	var transactions []models.Transaction
	if err := query.
		Offset(offset).
		Limit(perPage).
		Order("created_at DESC").
		Find(&transactions).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build response with point transaction fields
	type PointDetailResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`
		BalanceBefore float64 `json:"balanceBefore"`
		BalanceAfter  float64 `json:"balanceAfter"`
		PointBefore   float64 `json:"pointBefore"` // Point before transaction
		PointAfter    float64 `json:"pointAfter"`  // Point after transaction
		Explation     string  `json:"explation"`
		Status        string  `json:"status"`
		TransactionAt string  `json:"transactionAt"`
		ApprovedAt    string  `json:"approvedAt,omitempty"`
		CreatedAt     string  `json:"createdAt"`
		UpdatedAt     string  `json:"updatedAt"`
		User          struct {
			ID      uint   `json:"id"`
			Userid  string `json:"userid"`
			Name    string `json:"name"`
			Phone   string `json:"phone,omitempty"`
			Profile *struct {
				Nickname string  `json:"nickname"`
				Phone    string  `json:"phone"`
				Balance  float64 `json:"balance"`
				Point    int32   `json:"point"`
				Level    int32   `json:"level"`
			} `json:"profile,omitempty"`
		} `json:"user"`
	}

	responseData := make([]PointDetailResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = PointDetailResponse{
			ID:            t.ID,
			UserID:        t.UserID,
			Type:          t.Type,
			Amount:        t.Amount,
			BalanceBefore: t.BalanceBefore,
			BalanceAfter:  t.BalanceAfter,
			PointBefore:   t.PointBefore,
			PointAfter:    t.PointAfter,
			Explation:     t.Explation,
			Status:        t.Status,
			TransactionAt: t.TransactionAt.Format(time.RFC3339),
			CreatedAt:     t.CreatedAt.Format(time.RFC3339),
			UpdatedAt:     t.UpdatedAt.Format(time.RFC3339),
		}

		// Set ApprovedAt if not zero
		if !t.ApprovedAt.IsZero() {
			responseData[i].ApprovedAt = t.ApprovedAt.Format(time.RFC3339)
		}

		// Set User data
		responseData[i].User.ID = t.User.ID
		responseData[i].User.Userid = t.User.Userid
		responseData[i].User.Name = t.User.Name

		// Set Profile data if exists
		if t.User.Profile.ID != 0 {
			responseData[i].User.Profile = &struct {
				Nickname string  `json:"nickname"`
				Phone    string  `json:"phone"`
				Balance  float64 `json:"balance"`
				Point    int32   `json:"point"`
				Level    int32   `json:"level"`
			}{
				Nickname: t.User.Profile.Nickname,
				Phone:    t.User.Profile.Phone,
				Balance:  t.User.Profile.Balance,
				Point:    t.User.Profile.Point,
				Level:    t.User.Profile.Level,
			}
			// Also set phone at user level for easier access
			responseData[i].User.Phone = t.User.Profile.Phone
		}
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    responseData,
		"pagination": gin.H{
			"current_page": page,
			"from":         offset + 1,
			"to":           offset + len(transactions),
			"last_page":    (int(total) + perPage - 1) / perPage,
			"per_page":     perPage,
			"total":        total,
		},
	})
}
