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
	"gorm.io/gorm"
)

// GetPartnerRollingHistory returns rolling history transactions for the authenticated partner user
func GetPartnerRollingHistory(c *gin.Context) {
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
	typeFilter := c.Query("type") // "entire", "bettingRelatedRolling", "memberRollingCoversation", "rollingCoversationOfDistributor", "adminRollingPayments"
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")
	searchByRegistrationTime := c.Query("searchByRegistrationTime") == "true"

	// Build query for rolling transactions where user_id = partner.ID
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", partner.ID).
		Where("type = ?", "Rolling").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name, live").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("user_id, nickname, level")
			})
		})

	// Apply type filter
	if typeFilter != "" && typeFilter != "entire" {
		switch typeFilter {
		case "bettingRelatedRolling":
			// Betting-related rolling - transactions with shortcut (game info)
			query = query.Where("shortcut != ? AND shortcut != ?", "", " ")
		case "memberRollingCoversation":
			// Member rolling conversion - transactions with type "rollingExchange" but we're already filtering by "Rolling"
			// This might need adjustment based on actual business logic
			query = query.Where("explation LIKE ?", "%conversion%")
		case "rollingCoversationOfDistributor":
			// Rolling conversion of distributor
			query = query.Where("explation LIKE ?", "%distributor%")
		case "adminRollingPayments":
			// Administrator rolling payment
			query = query.Where("explation LIKE ?", "%admin%")
		}
	}

	// Apply date range filter
	dateField := "created_at"
	if !searchByRegistrationTime {
		dateField = "transaction_at"
	}

	if dateFrom != "" {
		query = query.Where(dateField+" >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where(dateField+" <= ?", dateToTime)
		} else {
			query = query.Where(dateField+" <= ?", dateTo)
		}
	}

	// Apply search filter (userid, nickname, account holder name)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		query = query.Where(
			"EXISTS (SELECT 1 FROM users JOIN profiles ON profiles.user_id = users.id WHERE users.id = transactions.user_id AND (LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ?))",
			searchPattern, searchPattern, searchPattern,
		)
	}

	// Get total count before pagination
	var total int64
	query.Model(&models.Transaction{}).Count(&total)

	// Calculate summary (betting amount and rollover amount)
	var bettingAmount float64
	var rolloverAmount float64
	summaryQuery := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", partner.ID).
		Where("type = ?", "Rolling")

	// Apply same filters for summary
	if typeFilter != "" && typeFilter != "entire" {
		switch typeFilter {
		case "bettingRelatedRolling":
			summaryQuery = summaryQuery.Where("shortcut != ? AND shortcut != ?", "", " ")
		case "memberRollingCoversation":
			summaryQuery = summaryQuery.Where("explation LIKE ?", "%conversion%")
		case "rollingCoversationOfDistributor":
			summaryQuery = summaryQuery.Where("explation LIKE ?", "%distributor%")
		case "adminRollingPayments":
			summaryQuery = summaryQuery.Where("explation LIKE ?", "%admin%")
		}
	}

	if dateFrom != "" {
		summaryQuery = summaryQuery.Where(dateField+" >= ?", dateFrom)
	}
	if dateTo != "" {
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			summaryQuery = summaryQuery.Where(dateField+" <= ?", dateToTime)
		} else {
			summaryQuery = summaryQuery.Where(dateField+" <= ?", dateTo)
		}
	}

	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		summaryQuery = summaryQuery.Where(
			"EXISTS (SELECT 1 FROM users JOIN profiles ON profiles.user_id = users.id WHERE users.id = transactions.user_id AND (LOWER(users.userid) LIKE ? OR LOWER(profiles.nickname) LIKE ? OR LOWER(profiles.holder_name) LIKE ?))",
			searchPattern, searchPattern, searchPattern,
		)
	}

	// Betting amount is the absolute sum of amounts (this represents the betting amount that generated the rolling)
	summaryQuery.Select("COALESCE(SUM(ABS(amount)), 0)").Scan(&bettingAmount)

	// Rollover amount is the sum of rolling gold (amount field in Rolling transactions)
	rolloverAmount = bettingAmount // For now, using same value. Adjust based on business logic if needed

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

	// Build response with rolling history fields
	type RollingHistoryResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`        // Rolling gold amount
		BalanceBefore float64 `json:"balanceBefore"` // Previous rolling fee
		BalanceAfter  float64 `json:"balanceAfter"`  // After that rolling money
		Shortcut      string  `json:"shortcut"`      // Game company|Game name
		Explation     string  `json:"explation"`
		Status        string  `json:"status"`
		TransactionAt string  `json:"transactionAt"` // Betting time
		CreatedAt     string  `json:"createdAt"`     // Registration time
		User          struct {
			ID      uint    `json:"id"`
			Userid  string  `json:"userid"`
			Name    string  `json:"name"`
			Live    float64 `json:"live"` // Rolling percentage
			Profile *struct {
				Nickname string `json:"nickname"`
				Level    int32  `json:"level"`
			} `json:"profile,omitempty"`
		} `json:"user"`
	}

	responseData := make([]RollingHistoryResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = RollingHistoryResponse{
			ID:            t.ID,
			UserID:        t.UserID,
			Type:          t.Type,
			Amount:        t.Amount,
			BalanceBefore: t.BalanceBefore,
			BalanceAfter:  t.BalanceAfter,
			Shortcut:      t.Shortcut,
			Explation:     t.Explation,
			Status:        t.Status,
			TransactionAt: t.TransactionAt.Format(time.RFC3339),
			CreatedAt:     t.CreatedAt.Format(time.RFC3339),
		}

		// Set User data
		responseData[i].User.ID = t.User.ID
		responseData[i].User.Userid = t.User.Userid
		responseData[i].User.Name = t.User.Name
		responseData[i].User.Live = t.User.Live

		// Set Profile data if exists
		if t.User.Profile.ID != 0 {
			responseData[i].User.Profile = &struct {
				Nickname string `json:"nickname"`
				Level    int32  `json:"level"`
			}{
				Nickname: t.User.Profile.Nickname,
				Level:    t.User.Profile.Level,
			}
		}
	}

	// Return response with summary
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    responseData,
		"summary": gin.H{
			"bettingAmount":  bettingAmount,
			"rolloverAmount": rolloverAmount,
		},
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
