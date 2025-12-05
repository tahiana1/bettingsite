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

// GetPartnerTransactions returns transactions for the authenticated partner user
func GetPartnerTransactions(c *gin.Context) {
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
	typeFilter := c.Query("type") // "entire", "deposit", "withdrawal", "cancellation", "delete"
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Build query for transactions where user_id = partner.ID
	// Use Unscoped() only when filtering for deleted transactions
	var query *gorm.DB
	if typeFilter == "delete" {
		query = initializers.DB.Unscoped().Model(&models.Transaction{}).
			Where("user_id = ?", partner.ID).
			Where("deleted_at IS NOT NULL").
			Preload("User", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
					return db.Select("user_id, balance, nickname, phone, level")
				})
			})
	} else {
		query = initializers.DB.Model(&models.Transaction{}).
			Where("user_id = ?", partner.ID).
			Preload("User", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
					return db.Select("user_id, balance, nickname, phone, level")
				})
			})
	}

	// Apply type filter
	if typeFilter != "" && typeFilter != "entire" {
		if typeFilter == "cancellation" {
			query = query.Where("status = ?", "C")
		} else if typeFilter != "delete" {
			// For "deposit" or "withdrawal" (delete is already handled above)
			query = query.Where("type = ?", typeFilter)
		}
	}

	// Apply date range filter
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else {
			query = query.Where("created_at <= ?", dateTo)
		}
	}

	// Apply search filter (nickname, phone, transaction ID)
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

	// Build response with only necessary fields
	type TransactionResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`
		BalanceBefore float64 `json:"balanceBefore"`
		BalanceAfter  float64 `json:"balanceAfter"`
		Explation     string  `json:"explation"`
		Status        string  `json:"status"`
		TransactionAt string  `json:"transactionAt"`
		ApprovedAt    string  `json:"approvedAt,omitempty"`
		CreatedAt     string  `json:"createdAt"`
		UpdatedAt     string  `json:"updatedAt"`
		DeletedAt     *string `json:"deletedAt,omitempty"`
		User          struct {
			ID      uint   `json:"id"`
			Userid  string `json:"userid"`
			Name    string `json:"name"`
			Phone   string `json:"phone,omitempty"`
			Profile *struct {
				Nickname string  `json:"nickname"`
				Phone    string  `json:"phone"`
				Balance  float64 `json:"balance"`
				Level    int32   `json:"level"`
			} `json:"profile,omitempty"`
		} `json:"user"`
	}

	responseData := make([]TransactionResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = TransactionResponse{
			ID:            t.ID,
			UserID:        t.UserID,
			Type:          t.Type,
			Amount:        t.Amount,
			BalanceBefore: t.BalanceBefore,
			BalanceAfter:  t.BalanceAfter,
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

		// Set DeletedAt if exists
		if t.DeletedAt != nil {
			deletedAtStr := t.DeletedAt.Time.Format(time.RFC3339)
			responseData[i].DeletedAt = &deletedAtStr
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
				Level    int32   `json:"level"`
			}{
				Nickname: t.User.Profile.Nickname,
				Phone:    t.User.Profile.Phone,
				Balance:  t.User.Profile.Balance,
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

// GetPartnerMoneyHistory returns money-related transactions for the authenticated partner user.
// It is similar to GetPartnerTransactions but restricted to specific transaction types that
// affect the partner's money/points history.
func GetPartnerMoneyHistory(c *gin.Context) {
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
	typeFilter := c.Query("type") // "entire" or a specific transaction type
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Allowed money history transaction types
	allowedTypes := []string{
		"deposit",
		"minigame_place",
		"rollingExchange",
		"point",
		"pointDeposit",
		"directDeposit",
		"directWithdraw",
	}

	// Base query: partner's transactions limited to allowed types
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", partner.ID).
		Where("type IN ?", allowedTypes).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("user_id, balance, nickname, phone, level")
			})
		})

	// Apply type filter if provided (and not "entire")
	if typeFilter != "" && typeFilter != "entire" {
		query = query.Where("type = ?", typeFilter)
	}

	// Apply date range filter
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
			dateToTime = dateToTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			query = query.Where("created_at <= ?", dateToTime)
		} else {
			query = query.Where("created_at <= ?", dateTo)
		}
	}

	// Apply search filter (nickname, phone, transaction ID)
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

	// Reuse the same response structure as GetPartnerTransactions
	type TransactionResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`
		BalanceBefore float64 `json:"balanceBefore"`
		BalanceAfter  float64 `json:"balanceAfter"`
		Explation     string  `json:"explation"`
		Status        string  `json:"status"`
		TransactionAt string  `json:"transactionAt"`
		ApprovedAt    string  `json:"approvedAt,omitempty"`
		CreatedAt     string  `json:"createdAt"`
		UpdatedAt     string  `json:"updatedAt"`
		DeletedAt     *string `json:"deletedAt,omitempty"`
		User          struct {
			ID      uint   `json:"id"`
			Userid  string `json:"userid"`
			Name    string `json:"name"`
			Phone   string `json:"phone,omitempty"`
			Profile *struct {
				Nickname string  `json:"nickname"`
				Phone    string  `json:"phone"`
				Balance  float64 `json:"balance"`
				Level    int32   `json:"level"`
			} `json:"profile,omitempty"`
		} `json:"user"`
	}

	responseData := make([]TransactionResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = TransactionResponse{
			ID:            t.ID,
			UserID:        t.UserID,
			Type:          t.Type,
			Amount:        t.Amount,
			BalanceBefore: t.BalanceBefore,
			BalanceAfter:  t.BalanceAfter,
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

		// Set DeletedAt if exists
		if t.DeletedAt != nil {
			deletedAtStr := t.DeletedAt.Time.Format(time.RFC3339)
			responseData[i].DeletedAt = &deletedAtStr
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
				Level    int32   `json:"level"`
			}{
				Nickname: t.User.Profile.Nickname,
				Phone:    t.User.Profile.Phone,
				Balance:  t.User.Profile.Balance,
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

// GetPartnerRollingTransactions returns rolling exchange transactions for the authenticated partner user
func GetPartnerRollingTransactions(c *gin.Context) {
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
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Build query for rolling exchange transactions where user_id = partner.ID
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", partner.ID).
		Where("type = ?", "rollingExchange").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("user_id, balance, roll, nickname, phone, level")
			})
		})

	// Apply date range filter
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
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

	// Build response with rolling transaction fields
	type RollingTransactionResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`
		BalanceBefore float64 `json:"balanceBefore"`
		BalanceAfter  float64 `json:"balanceAfter"`
		PointBefore   float64 `json:"pointBefore"` // Used for rolling before
		PointAfter    float64 `json:"pointAfter"`  // Used for rolling after
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
				Roll     float64 `json:"roll"`
				Level    int32   `json:"level"`
			} `json:"profile,omitempty"`
		} `json:"user"`
	}

	responseData := make([]RollingTransactionResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = RollingTransactionResponse{
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
				Roll     float64 `json:"roll"`
				Level    int32   `json:"level"`
			}{
				Nickname: t.User.Profile.Nickname,
				Phone:    t.User.Profile.Phone,
				Balance:  t.User.Profile.Balance,
				Roll:     t.User.Profile.Roll,
				Level:    t.User.Profile.Level,
			}
			// Also set phone at user level for easier access
			responseData[i].User.Phone = t.User.Profile.Phone
		}
	}

	// Get partner profile for summary
	var profile models.Profile
	if err := initializers.DB.Where("user_id = ?", partner.ID).First(&profile).Error; err == nil {
		// Return response with summary
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    responseData,
			"summary": gin.H{
				"amountHeld":     profile.Balance, // Amount held (balance)
				"rollingBalance": profile.Roll,    // Rolling balance
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
	} else {
		// Return response without summary if profile not found
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    responseData,
			"summary": gin.H{
				"amountHeld":     0.0,
				"rollingBalance": 0.0,
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
}

// GetPartnerPointTransactions returns point conversion transactions for the authenticated partner user
func GetPartnerPointTransactions(c *gin.Context) {
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
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Build query for point conversion transactions where user_id = partner.ID
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", partner.ID).
		Where("type = ?", "point").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("user_id, balance, point, nickname, phone, level")
			})
		})

	// Apply date range filter
	if dateFrom != "" {
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
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
	type PointTransactionResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`
		BalanceBefore float64 `json:"balanceBefore"`
		BalanceAfter  float64 `json:"balanceAfter"`
		PointBefore   float64 `json:"pointBefore"` // Point before conversion
		PointAfter    float64 `json:"pointAfter"`  // Point after conversion
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

	responseData := make([]PointTransactionResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = PointTransactionResponse{
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

	// Get partner profile for summary
	var profile models.Profile
	if err := initializers.DB.Where("user_id = ?", partner.ID).First(&profile).Error; err == nil {
		// Return response with summary
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    responseData,
			"summary": gin.H{
				"amountHeld": profile.Balance,        // Amount held (balance)
				"pointsHeld": float64(profile.Point), // Points held
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
	} else {
		// Return response without summary if profile not found
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    responseData,
			"summary": gin.H{
				"amountHeld": 0.0,
				"pointsHeld": 0.0,
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
}

// GetPartnerPointDetails returns point-related transactions (point and pointDeposit) for the authenticated partner user
func GetPartnerPointDetails(c *gin.Context) {
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

	// Base query: partner's transactions limited to point and pointDeposit types
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", partner.ID).
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
		query = query.Where("created_at >= ?", dateFrom)
	}
	if dateTo != "" {
		// Add end of day to dateTo
		if dateToTime, err := time.Parse("2006-01-02", dateTo); err == nil {
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

// GetPartnerIntegratedMoneyTransferHistory returns all transaction history for sub users (where parent_id = partner.ID)
// Transaction types: deposit, withdrawal, win, Rolling, bet, WithdrawalCasino, DepositCasino,
// minigame_place, minigame_Win, rollingExchange, point, pointDeposit, directWithdraw, directDeposit
func GetPartnerIntegratedMoneyTransferHistory(c *gin.Context) {
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
	typeFilter := c.Query("type") // "entire" or a specific transaction type
	searchQuery := c.Query("search")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	// Allowed transaction types for integrated money transfer history
	allowedTypes := []string{
		"deposit",
		"withdrawal",
		"win",
		"Rolling",
		"bet",
		"WithdrawalCasino",
		"DepositCasino",
		"minigame_place",
		"minigame_Win",
		"rollingExchange",
		"point",
		"pointDeposit",
		"directWithdraw",
		"directDeposit",
	}

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

	// Build query for transactions where user_id IN subUserIDs and type IN allowedTypes
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ?", subUserIDs).
		Where("type IN ?", allowedTypes).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, userid, name").Preload("Profile", func(db *gorm.DB) *gorm.DB {
				return db.Select("user_id, balance, nickname, phone, level")
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

	// Apply search filter (ID, nickname, userid, account)
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

	// Build response with transaction fields
	type IntegratedTransactionResponse struct {
		ID            uint    `json:"id"`
		UserID        uint    `json:"userId"`
		Type          string  `json:"type"`
		Amount        float64 `json:"amount"`
		BalanceBefore float64 `json:"balanceBefore"`
		BalanceAfter  float64 `json:"balanceAfter"`
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
				Level    int32   `json:"level"`
			} `json:"profile,omitempty"`
		} `json:"user"`
	}

	responseData := make([]IntegratedTransactionResponse, len(transactions))
	for i, t := range transactions {
		responseData[i] = IntegratedTransactionResponse{
			ID:            t.ID,
			UserID:        t.UserID,
			Type:          t.Type,
			Amount:        t.Amount,
			BalanceBefore: t.BalanceBefore,
			BalanceAfter:  t.BalanceAfter,
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
				Level    int32   `json:"level"`
			}{
				Nickname: t.User.Profile.Nickname,
				Phone:    t.User.Profile.Phone,
				Balance:  t.User.Profile.Balance,
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
