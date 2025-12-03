package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// GetPartnerCasinoBetting retrieves casino bets for users under partner management
func GetPartnerCasinoBetting(c *gin.Context) {
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

	var input struct {
		Limit          int    `json:"limit"`
		Offset         int    `json:"offset"`
		GameNameFilter string `json:"game_name_filter"`
		Status         string `json:"status"`
		DateFrom       string `json:"date_from"`
		DateTo         string `json:"date_to"`
		Search         string `json:"search"`
	}

	// Set default values
	if err := c.ShouldBindJSON(&input); err != nil {
		input.Limit = 25
		input.Offset = 0
	}

	if input.Limit == 0 {
		input.Limit = 25
	}

	// Build query with partner filter - only users under this partner
	query := initializers.DB.Model(&models.CasinoBet{}).
		Joins("JOIN users ON users.id = casino_bets.user_id").
		Where("users.parent_id = ?", partner.ID).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Profile").Preload("Root").Preload("Parent")
		})

	// Apply filters
	if input.GameNameFilter != "" {
		if input.GameNameFilter == "slot" {
			query = query.Where("casino_bets.game_name LIKE ?", "%slot%")
		} else if input.GameNameFilter == "not_slot" {
			query = query.Where("casino_bets.game_name NOT LIKE ?", "%slot%")
		}
	}

	if input.Status != "" && (input.Status == "bet" || input.Status == "win") {
		query = query.Where("casino_bets.type = ?", input.Status)
	}

	if input.DateFrom != "" {
		query = query.Where("casino_bets.created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		query = query.Where("casino_bets.created_at <= ?", input.DateTo)
	}

	// Apply search filter
	if input.Search != "" {
		searchPattern := "%" + input.Search + "%"
		query = query.Joins("JOIN profiles ON profiles.user_id = users.id").
			Where("CAST(casino_bets.id AS TEXT) LIKE ? OR casino_bets.trans_id LIKE ? OR profiles.nickname LIKE ? OR profiles.phone LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern)
	}

	// Get all records
	var allRecords []models.CasinoBet
	if err := query.
		Order("casino_bets.user_id ASC, casino_bets.betting_time ASC, casino_bets.created_at ASC").
		Find(&allRecords).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Consolidate bet/win pairs (same logic as admin version)
	type ConsolidatedBet struct {
		ID           uint         `json:"id"`
		UserID       uint         `json:"userId"`
		User         *models.User `json:"user"`
		GameID       uint         `json:"gameId"`
		GameName     string       `json:"gameName"`
		TransID      string       `json:"transId"`
		BettingTime  uint         `json:"bettingTime"`
		Details      interface{}  `json:"details"`
		BetAmount    float64      `json:"betAmount"`
		WinAmount    float64      `json:"winAmount"`
		NetAmount    float64      `json:"netAmount"`
		ResultStatus string       `json:"resultStatus"`
		BeforeAmount float64      `json:"beforeAmount"`
		AfterAmount  float64      `json:"afterAmount"`
		Status       string       `json:"status"`
		CreatedAt    time.Time    `json:"createdAt"`
		UpdatedAt    time.Time    `json:"updatedAt"`
		BetID        uint         `json:"betId"`
		WinID        uint         `json:"winId"`
	}

	var consolidatedBets []ConsolidatedBet

	// Group records by user_id and betting_time
	type GroupKey struct {
		UserID      uint
		BettingTime uint
	}
	groups := make(map[GroupKey][]models.CasinoBet)

	for _, record := range allRecords {
		key := GroupKey{
			UserID:      record.UserID,
			BettingTime: record.BettingTime,
		}
		groups[key] = append(groups[key], record)
	}

	// Process each group to match bet/win pairs
	for _, group := range groups {
		var bets []models.CasinoBet
		var wins []models.CasinoBet

		for _, record := range group {
			if record.Type == "bet" {
				bets = append(bets, record)
			} else if record.Type == "win" {
				wins = append(wins, record)
			}
		}

		sort.Slice(bets, func(i, j int) bool {
			return bets[i].CreatedAt.Before(bets[j].CreatedAt)
		})
		sort.Slice(wins, func(i, j int) bool {
			return wins[i].CreatedAt.Before(wins[j].CreatedAt)
		})

		matchedBets := make(map[uint]bool)
		matchedWins := make(map[uint]bool)

		for i := range bets {
			if matchedBets[bets[i].ID] {
				continue
			}

			for j := range wins {
				if matchedWins[wins[j].ID] {
					continue
				}

				if bets[i].AfterAmount == wins[j].BeforeAmount {
					betAmount := bets[i].Amount
					winAmount := wins[j].Amount

					resultStatus := "lost"
					if winAmount > 0 {
						resultStatus = "won"
					}

					netAmount := winAmount + betAmount

					consolidated := ConsolidatedBet{
						ID:           bets[i].ID,
						UserID:       bets[i].UserID,
						User:         bets[i].User,
						GameID:       bets[i].GameID,
						GameName:     bets[i].GameName,
						TransID:      bets[i].TransID,
						BettingTime:  bets[i].BettingTime,
						Details:      wins[j].Details,
						BetAmount:    betAmount,
						WinAmount:    winAmount,
						NetAmount:    netAmount,
						ResultStatus: resultStatus,
						BeforeAmount: bets[i].BeforeAmount,
						AfterAmount:  wins[j].AfterAmount,
						Status:       bets[i].Status,
						CreatedAt:    bets[i].CreatedAt,
						UpdatedAt:    wins[j].UpdatedAt,
						BetID:        bets[i].ID,
						WinID:        wins[j].ID,
					}

					consolidatedBets = append(consolidatedBets, consolidated)
					matchedBets[bets[i].ID] = true
					matchedWins[wins[j].ID] = true
					break
				}
			}
		}

		// Handle unmatched bets (pending)
		for i := range bets {
			if !matchedBets[bets[i].ID] {
				consolidated := ConsolidatedBet{
					ID:           bets[i].ID,
					UserID:       bets[i].UserID,
					User:         bets[i].User,
					GameID:       bets[i].GameID,
					GameName:     bets[i].GameName,
					TransID:      bets[i].TransID,
					BettingTime:  bets[i].BettingTime,
					Details:      bets[i].Details,
					BetAmount:    bets[i].Amount,
					WinAmount:    0,
					NetAmount:    bets[i].Amount,
					ResultStatus: "pending",
					BeforeAmount: bets[i].BeforeAmount,
					AfterAmount:  bets[i].AfterAmount,
					Status:       bets[i].Status,
					CreatedAt:    bets[i].CreatedAt,
					UpdatedAt:    bets[i].UpdatedAt,
					BetID:        bets[i].ID,
					WinID:        0,
				}
				consolidatedBets = append(consolidatedBets, consolidated)
			}
		}
	}

	// Apply status filter after consolidation
	if input.Status != "" && input.Status != "bet" && input.Status != "win" {
		filteredBets := []ConsolidatedBet{}
		for _, bet := range consolidatedBets {
			if input.Status == "won" && bet.ResultStatus == "won" {
				filteredBets = append(filteredBets, bet)
			} else if input.Status == "lost" && bet.ResultStatus == "lost" {
				filteredBets = append(filteredBets, bet)
			} else if input.Status == "pending" && bet.ResultStatus == "pending" {
				filteredBets = append(filteredBets, bet)
			} else if input.Status == "cancelled" && bet.Status == "cancelled" {
				filteredBets = append(filteredBets, bet)
			}
		}
		consolidatedBets = filteredBets
	}

	// Sort by created_at DESC
	sort.Slice(consolidatedBets, func(i, j int) bool {
		return consolidatedBets[i].CreatedAt.After(consolidatedBets[j].CreatedAt)
	})

	// Get total count before pagination
	total := int64(len(consolidatedBets))

	// Apply pagination
	start := input.Offset
	end := input.Offset + input.Limit
	if start > len(consolidatedBets) {
		start = len(consolidatedBets)
	}
	if end > len(consolidatedBets) {
		end = len(consolidatedBets)
	}

	var paginatedBets []ConsolidatedBet
	if start < len(consolidatedBets) {
		paginatedBets = consolidatedBets[start:end]
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Casino Bets retrieved successfully",
		"status":  true,
		"data":    paginatedBets,
		"total":   total,
	})
}

// GetPartnerMiniGameBetting retrieves mini game bets for users under partner management
func GetPartnerMiniGameBetting(c *gin.Context) {
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

	var input struct {
		Limit    int    `json:"limit"`
		Offset   int    `json:"offset"`
		Status   string `json:"status"`
		DateFrom string `json:"date_from"`
		DateTo   string `json:"date_to"`
		Search   string `json:"search"`
	}

	// Set default values
	if err := c.ShouldBindJSON(&input); err != nil {
		input.Limit = 25
		input.Offset = 0
	}

	if input.Limit == 0 {
		input.Limit = 25
	}

	// Build query with partner filter - only users under this partner
	query := initializers.DB.Model(&models.Transaction{}).
		Where("type = ?", "minigame_place").
		Joins("JOIN users ON users.id = transactions.user_id").
		Where("users.parent_id = ?", partner.ID).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Profile").Preload("Root").Preload("Parent")
		})

	// Apply status filter
	if input.Status != "" && input.Status != "entire" {
		query = query.Where("transactions.status = ?", input.Status)
	}

	// Apply date filters
	if input.DateFrom != "" {
		query = query.Where("transactions.created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		query = query.Where("transactions.created_at <= ?", input.DateTo)
	}

	// Apply search filter
	if input.Search != "" {
		searchPattern := "%" + input.Search + "%"
		query = query.Joins("JOIN profiles ON profiles.user_id = users.id").
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
		Order("transactions.created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&transactions).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Map transactions to mini game bets format
	type MiniGameBet struct {
		ID            uint         `json:"id"`
		Type          string       `json:"type"`
		UserID        uint         `json:"userId"`
		User          *models.User `json:"user"`
		GameID        uint         `json:"gameId"`
		Amount        float64      `json:"amount"`
		Status        string       `json:"status"`
		GameName      string       `json:"gameName"`
		TransID       string       `json:"transId"`
		WinningAmount float64      `json:"winningAmount"`
		BettingTime   uint         `json:"bettingTime"`
		Details       interface{}  `json:"details"`
		BeforeAmount  float64      `json:"beforeAmount"`
		AfterAmount   float64      `json:"afterAmount"`
		CreatedAt     time.Time    `json:"createdAt"`
		UpdatedAt     time.Time    `json:"updatedAt"`
	}

	var miniGameBets []MiniGameBet
	for _, tx := range transactions {
		bettingTime := uint(tx.TransactionAt.Unix())
		var winningAmount float64
		if tx.Amount < 0 {
			winningAmount = 0
		} else {
			winningAmount = tx.Amount
		}

		miniGameBet := MiniGameBet{
			ID:            tx.ID,
			Type:          tx.Type,
			UserID:        tx.UserID,
			User:          &tx.User,
			GameID:        0,
			Amount:        tx.Amount,
			Status:        tx.Status,
			GameName:      "",
			TransID:       strconv.FormatUint(uint64(tx.ID), 10),
			WinningAmount: winningAmount,
			BettingTime:   bettingTime,
			Details:       tx.Explation,
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
