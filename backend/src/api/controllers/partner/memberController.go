package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
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

