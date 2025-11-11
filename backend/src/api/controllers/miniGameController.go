package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// GetAllMiniGameBetting retrieves all minigame betting records from transactions table
func GetAllMiniGameBetting(c *gin.Context) {
	var input struct {
		Limit    int    `json:"limit"`
		Offset   int    `json:"offset"`
		Status   string `json:"status"`
		DateFrom string `json:"date_from"`
		DateTo   string `json:"date_to"`
		Search   string `json:"search"` // For searching nickname, phone, or transaction ID
	}

	// Set default values
	if err := c.ShouldBindJSON(&input); err != nil {
		// Use default values if JSON is not provided
		input.Limit = 25
		input.Offset = 0
	}

	if input.Limit == 0 {
		input.Limit = 25
	}

	// Build query for transactions with type = "minigame_place"
	query := initializers.DB.Model(&models.Transaction{}).
		Where("type = ?", "minigame_place").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Profile").Preload("Root").Preload("Parent")
		})

	// Apply status filter
	if input.Status != "" && input.Status != "entire" {
		query = query.Where("status = ?", input.Status)
	}

	// Apply date filters
	if input.DateFrom != "" {
		query = query.Where("created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		query = query.Where("created_at <= ?", input.DateTo)
	}

	// Apply search filter (nickname, phone, or transaction ID)
	if input.Search != "" {
		searchPattern := "%" + input.Search + "%"
		query = query.Joins("JOIN users ON users.id = transactions.user_id").
			Joins("JOIN profiles ON profiles.user_id = users.id").
			Where("CAST(transactions.id AS TEXT) LIKE ? OR profiles.nickname LIKE ? OR profiles.phone LIKE ?",
				searchPattern, searchPattern, searchPattern)
	}

	// Get total count
	var total int64
	if err := query.Count(&total).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated transactions
	var transactions []models.Transaction
	if err := query.
		Order("created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&transactions).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Map transactions to match the expected frontend interface
	type MiniGameBet struct {
		ID            uint            `json:"id"`
		Type          string          `json:"type"`
		UserID        uint            `json:"userId"`
		User          *models.User    `json:"user"`
		GameID        uint            `json:"gameId"`
		Amount        float64         `json:"amount"`
		Status        string          `json:"status"`
		GameName      string          `json:"gameName"`
		TransID       string          `json:"transId"`
		WinningAmount float64         `json:"winningAmount"`
		BettingTime   uint            `json:"bettingTime"`
		Details       interface{}     `json:"details"`
		BeforeAmount  float64         `json:"beforeAmount"`
		AfterAmount   float64         `json:"afterAmount"`
		CreatedAt     time.Time       `json:"createdAt"`
		UpdatedAt     time.Time       `json:"updatedAt"`
	}

	var miniGameBets []MiniGameBet
	for _, tx := range transactions {
		// Convert TransactionAt to Unix timestamp (seconds)
		bettingTime := uint(tx.TransactionAt.Unix())

		// Try to extract game info from Explation if it's JSON
		var details interface{}
		var gameID uint
		var gameName string
		var winningAmount float64

		// If Explation contains JSON, try to parse it
		if tx.Explation != "" {
			// Try to parse as JSON for details
			details = tx.Explation
		}

		// Calculate winning amount
		if tx.Amount < 0 {
			// This is a bet, winning amount is 0 initially
			winningAmount = 0
		} else {
			// This might be a win transaction
			winningAmount = tx.Amount
		}

		miniGameBet := MiniGameBet{
			ID:            tx.ID,
			Type:          tx.Type,
			UserID:        tx.UserID,
			User:          &tx.User,
			GameID:        gameID,
			Amount:        tx.Amount,
			Status:        tx.Status,
			GameName:      gameName,
			TransID:       strconv.Itoa(int(tx.ID)), // Convert transaction ID to string
			WinningAmount: winningAmount,
			BettingTime:   bettingTime,
			Details:       details,
			BeforeAmount:  tx.BalanceBefore,
			AfterAmount:   tx.BalanceAfter,
			CreatedAt:     tx.CreatedAt,
			UpdatedAt:     tx.UpdatedAt,
		}

		miniGameBets = append(miniGameBets, miniGameBet)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mini Game Bets retrieved successfully",
		"status":  true,
		"data":    miniGameBets,
		"total":   total,
	})
}

// GetAllMiniGameBettingTest is a test endpoint without auth for debugging
func GetAllMiniGameBettingTest(c *gin.Context) {
	// Simple test version without complex filtering
	var transactions []models.Transaction
	err := initializers.DB.
		Where("type = ?", "minigame_place").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Profile").Preload("Root").Preload("Parent")
		}).
		Limit(10).
		Find(&transactions).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mini Game Bets retrieved successfully",
		"status":  true,
		"data":    transactions,
		"total":   len(transactions),
	})
}

