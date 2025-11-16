package controllers

import (
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
	"gorm.io/gorm"
)

func GetBetting(c *gin.Context) {
	var input struct {
		UserID uint `json:"user_id" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Set default pagination values if not provided

	// Build query
	query := initializers.DB.Model(&models.Bet{}).
		Preload("Fixture").
		Preload("Fixture.HomeTeam").
		Preload("Fixture.AwayTeam").
		Preload("Fixture.League").
		Preload("Market").
		Where("user_id = ?", input.UserID)

	// Get total count for pagination
	var total int64
	if err := query.Count(&total).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated bets
	var bets []models.Bet
	if err := query.
		Order("placed_at DESC").
		Find(&bets).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Group bets by placed_at time
	betGroups := make(map[time.Time][]models.Bet)
	for _, bet := range bets {
		// Round to nearest second to group bets placed within the same second
		placedAt := bet.PlacedAt.Truncate(time.Second)
		betGroups[placedAt] = append(betGroups[placedAt], bet)
	}

	// Convert map to array of groups
	type BetGroup struct {
		PlacedAt time.Time    `json:"placedAt"`
		Bets     []models.Bet `json:"bets"`
	}

	var groupedBets []BetGroup
	for placedAt, groupBets := range betGroups {
		groupedBets = append(groupedBets, BetGroup{
			PlacedAt: placedAt,
			Bets:     groupBets,
		})
	}

	// Sort groups by placed_at time (most recent first)
	sort.Slice(groupedBets, func(i, j int) bool {
		return groupedBets[i].PlacedAt.After(groupedBets[j].PlacedAt)
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "Bets retrieved successfully",
		"data":    groupedBets,
		"status":  true,
	})
}

func GetCasinoBetting(c *gin.Context) {
	var input struct {
		UserID uint `json:"user_id" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var CasinoBet []models.CasinoBet
	err := initializers.DB.Where("user_id = ?", input.UserID).Find(&CasinoBet).Error
	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Casino Bet retrieved successfully",
		"status":  true,
		"data":    CasinoBet,
	})
}

func GetAllCasinoBetting(c *gin.Context) {
	var input struct {
		Limit          int    `json:"limit"`
		Offset         int    `json:"offset"`
		GameNameFilter string `json:"game_name_filter"`
		Status         string `json:"status"`
		DateFrom       string `json:"date_from"`
		DateTo         string `json:"date_to"`
		Search         string `json:"search"` // For searching nickname, phone, or transaction ID
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

	// Build query with preloads - fetch both bet and win types
	query := initializers.DB.Model(&models.CasinoBet{}).
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

	// Don't filter by status here - we'll filter after consolidation
	// Only filter by type if status is specifically looking for bet or win
	if input.Status != "" && (input.Status == "bet" || input.Status == "win") {
		query = query.Where("casino_bets.type = ?", input.Status)
	}

	if input.DateFrom != "" {
		query = query.Where("casino_bets.created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		query = query.Where("casino_bets.created_at <= ?", input.DateTo)
	}

	// Apply search filter (nickname, phone, or transaction ID)
	if input.Search != "" {
		searchPattern := "%" + input.Search + "%"
		query = query.Joins("JOIN users ON users.id = casino_bets.user_id").
			Joins("JOIN profiles ON profiles.user_id = users.id").
			Where("CAST(casino_bets.id AS TEXT) LIKE ? OR casino_bets.trans_id LIKE ? OR profiles.nickname LIKE ? OR profiles.phone LIKE ?",
				searchPattern, searchPattern, searchPattern, searchPattern)
	}

	// Get all records (both bet and win) that match filters, ordered by user_id, betting_time, and created_at
	var allRecords []models.CasinoBet
	if err := query.
		Order("casino_bets.user_id ASC, casino_bets.betting_time ASC, casino_bets.created_at ASC").
		Find(&allRecords).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Consolidate bet/win pairs
	type ConsolidatedBet struct {
		ID           uint         `json:"id"`
		UserID       uint         `json:"userId"`
		User         *models.User `json:"user"`
		GameID       uint         `json:"gameId"`
		GameName     string       `json:"gameName"`
		TransID      string       `json:"transId"`
		BettingTime  uint         `json:"bettingTime"`
		Details      interface{}  `json:"details"`
		BetAmount    float64      `json:"betAmount"`    // Original bet amount (negative)
		WinAmount    float64      `json:"winAmount"`    // Win amount (0 for loss, positive for win)
		NetAmount    float64      `json:"netAmount"`    // Net change (winAmount - abs(betAmount))
		ResultStatus string       `json:"resultStatus"` // "won" or "lost"
		BeforeAmount float64      `json:"beforeAmount"` // Balance before bet
		AfterAmount  float64      `json:"afterAmount"`  // Balance after win
		Status       string       `json:"status"`       // Original status from bet record
		CreatedAt    time.Time    `json:"createdAt"`    // Bet creation time
		UpdatedAt    time.Time    `json:"updatedAt"`    // Win update time
		BetID        uint         `json:"betId"`        // ID of bet record
		WinID        uint         `json:"winId"`        // ID of win record
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
		// Separate bets and wins
		var bets []models.CasinoBet
		var wins []models.CasinoBet

		for _, record := range group {
			if record.Type == "bet" {
				bets = append(bets, record)
			} else if record.Type == "win" {
				wins = append(wins, record)
			}
		}

		// Sort bets and wins by created_at to ensure correct matching order
		sort.Slice(bets, func(i, j int) bool {
			return bets[i].CreatedAt.Before(bets[j].CreatedAt)
		})
		sort.Slice(wins, func(i, j int) bool {
			return wins[i].CreatedAt.Before(wins[j].CreatedAt)
		})

		// Match bets with wins using the balance chain
		// The after_amount of a bet should match the before_amount of its corresponding win
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

				// Match if bet's after_amount equals win's before_amount
				// Also check that they have the same user_id and betting_time (already grouped)
				if bets[i].AfterAmount == wins[j].BeforeAmount {
					// Found a match
					betAmount := bets[i].Amount // This is negative
					winAmount := wins[j].Amount // This is 0 for loss, positive for win

					// Determine result status
					resultStatus := "lost"
					if winAmount > 0 {
						resultStatus = "won"
					}

					// Calculate net amount
					netAmount := winAmount + betAmount // betAmount is negative, so this is winAmount - abs(betAmount)

					consolidated := ConsolidatedBet{
						ID:           bets[i].ID, // Use bet ID as primary
						UserID:       bets[i].UserID,
						User:         bets[i].User,
						GameID:       bets[i].GameID,
						GameName:     bets[i].GameName,
						TransID:      bets[i].TransID,
						BettingTime:  bets[i].BettingTime,
						Details:      wins[j].Details, // Use win record's details as it has the final/complete information
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

		// Handle unmatched bets (bets without corresponding wins - pending bets)
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

	// Sort by created_at DESC (most recent first)
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

func GetAllCasinoBettingTest(c *gin.Context) {
	// Simple test version without complex filtering
	var casinoBets []models.CasinoBet
	err := initializers.DB.Preload("User").Limit(10).Find(&casinoBets).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Casino Bets retrieved successfully",
		"status":  true,
		"data":    casinoBets,
		"total":   len(casinoBets),
	})
}

func CreateBetting(c *gin.Context) {
	var betsInput []struct {
		UserID    uint    `json:"user_id" binding:"required,min=1"`
		FixtureID uint    `json:"fixture_id" binding:"required,min=1"`
		MarketID  uint    `json:"market_id" binding:"required,min=1"`
		Selection string  `json:"selection" binding:"required"`
		Odds      float64 `json:"odds" binding:"required,gt=1"`
		Stake     float64 `json:"stake" binding:"required,gte=0"`
	}

	if err := c.ShouldBindJSON(&betsInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if len(betsInput) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No bets provided",
		})
		return
	}

	// Get user's profile to check current balance
	var profile models.Profile
	if err := initializers.DB.Where("user_id = ?", betsInput[0].UserID).First(&profile).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Use the stake from the first bet as the total stake
	totalStake := betsInput[0].Stake

	// Check if user has sufficient balance
	if profile.Balance < totalStake {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Insufficient balance to place bets",
		})
		return
	}

	// Calculate combined odds (product of all odds)
	combinedOdds := 1.0
	for _, betInput := range betsInput {
		combinedOdds *= betInput.Odds
	}

	// Calculate potential payout
	potentialPayout := totalStake * combinedOdds

	// Create all bets
	var bets []models.Bet
	for _, betInput := range betsInput {
		bet := models.Bet{
			UserID:          betInput.UserID,
			FixtureID:       betInput.FixtureID,
			MarketID:        betInput.MarketID,
			Selection:       betInput.Selection,
			Odds:            betInput.Odds,
			Stake:           betInput.Stake,
			PotentialPayout: potentialPayout, // same for all bets
			Status:          "pending",
		}
		bets = append(bets, bet)
	}

	// Start transaction
	tx := initializers.DB.Begin()

	// Create all bets in DB
	if err := tx.Create(&bets).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Deduct total stake from user's balance
	profile.Balance -= totalStake
	if err := tx.Model(&profile).Updates(map[string]interface{}{
		"balance": profile.Balance,
	}).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Create transaction record for the bet placement
	transaction := models.Transaction{
		UserID:        betsInput[0].UserID,
		Type:          "betting/placingBet",
		Amount:        totalStake,
		BalanceBefore: profile.Balance + totalStake,
		BalanceAfter:  profile.Balance,
		Status:        "A",
		Explation:     "betting/placingBet",
		TransactionAt: time.Now(),
	}

	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	var profile1 models.Profile
	if err := initializers.DB.Where("user_id = ?", betsInput[0].UserID).First(&profile1).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	profile1.Balance += potentialPayout - totalStake
	if err := tx.Model(&profile1).Updates(map[string]interface{}{
		"balance": profile1.Balance,
	}).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Create transaction record for the bet settlement
	transaction1 := models.Transaction{
		UserID:        betsInput[0].UserID,
		Type:          "bettingSettlement",
		Amount:        potentialPayout,
		BalanceBefore: profile.Balance,
		BalanceAfter:  profile1.Balance,
		Status:        "A",
		Explation:     "bettingSettlement",
		TransactionAt: time.Now(),
	}

	if err := tx.Create(&transaction1).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bets placed successfully",
		"data": gin.H{
			"bets":       bets,
			"newBalance": profile.Balance,
			"status":     true,
		},
		"status": true,
	})
}

func GetUserBettingHistory(c *gin.Context) {
	var input struct {
		UserID   uint   `json:"user_id" binding:"required,min=1"`
		Limit    int    `json:"limit"`
		Offset   int    `json:"offset"`
		Status   string `json:"status"`
		DateFrom string `json:"date_from"`
		DateTo   string `json:"date_to"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Set default values
	if input.Limit == 0 {
		input.Limit = 25
	}

	// Build query for casino bets with preloads
	casinoQuery := initializers.DB.Model(&models.CasinoBet{}).
		Where("user_id = ?", input.UserID)

	// Apply filters for casino bets
	if input.Status != "" {
		casinoQuery = casinoQuery.Where("status = ?", input.Status)
	}

	if input.DateFrom != "" {
		casinoQuery = casinoQuery.Where("created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		casinoQuery = casinoQuery.Where("created_at <= ?", input.DateTo)
	}

	// Get total count for casino bets
	var casinoTotal int64
	if err := casinoQuery.Count(&casinoTotal).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated casino bets
	var casinoBets []models.CasinoBet
	if err := casinoQuery.
		Order("created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&casinoBets).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build query for sports bets with preloads
	sportsQuery := initializers.DB.Model(&models.Bet{}).
		Preload("Fixture").
		Preload("Fixture.HomeTeam").
		Preload("Fixture.AwayTeam").
		Preload("Fixture.League").
		Preload("Market").
		Where("user_id = ?", input.UserID)

	// Apply filters for sports bets
	if input.Status != "" {
		sportsQuery = sportsQuery.Where("status = ?", input.Status)
	}

	if input.DateFrom != "" {
		sportsQuery = sportsQuery.Where("placed_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		sportsQuery = sportsQuery.Where("placed_at <= ?", input.DateTo)
	}

	// Get total count for sports bets
	var sportsTotal int64
	if err := sportsQuery.Count(&sportsTotal).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated sports bets
	var sportsBets []models.Bet
	if err := sportsQuery.
		Order("placed_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&sportsBets).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User betting history retrieved successfully",
		"status":  true,
		"data": gin.H{
			"casinoBets":   casinoBets,
			"sportsBets":   sportsBets,
			"casinoTotal":  casinoTotal,
			"sportsTotal":  sportsTotal,
			"totalRecords": casinoTotal + sportsTotal,
		},
	})
}

func GetUserBettingHistoryV2(c *gin.Context) {
	var input struct {
		UserID   uint   `json:"user_id" binding:"required,min=1"`
		Limit    int    `json:"limit"`
		Offset   int    `json:"offset"`
		Status   string `json:"status"`
		DateFrom string `json:"date_from"`
		DateTo   string `json:"date_to"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"validations": validations.FormatValidationErrors(errs),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Set default values
	if input.Limit == 0 {
		input.Limit = 25
	}

	// Build query for casino bets (not slot) with preloads
	casinoQuery := initializers.DB.Model(&models.CasinoBet{}).
		Where("user_id = ?", input.UserID).
		Where("game_name NOT LIKE ?", "%slot%")

	// Apply filters for casino bets
	if input.Status != "" && input.Status != "entire" {
		casinoQuery = casinoQuery.Where("status = ?", input.Status)
	}

	if input.DateFrom != "" {
		casinoQuery = casinoQuery.Where("created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		casinoQuery = casinoQuery.Where("created_at <= ?", input.DateTo)
	}

	// Get total count for casino bets
	var casinoTotal int64
	if err := casinoQuery.Count(&casinoTotal).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated casino bets
	var casinoBets []models.CasinoBet
	if err := casinoQuery.
		Order("created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&casinoBets).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build query for slot bets with preloads
	slotQuery := initializers.DB.Model(&models.CasinoBet{}).
		Where("user_id = ?", input.UserID).
		Where("game_name LIKE ?", "%slot%")

	// Apply filters for slot bets
	if input.Status != "" && input.Status != "entire" {
		slotQuery = slotQuery.Where("status = ?", input.Status)
	}

	if input.DateFrom != "" {
		slotQuery = slotQuery.Where("created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		slotQuery = slotQuery.Where("created_at <= ?", input.DateTo)
	}

	// Get total count for slot bets
	var slotTotal int64
	if err := slotQuery.Count(&slotTotal).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated slot bets
	var slotBets []models.CasinoBet
	if err := slotQuery.
		Order("created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&slotBets).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Build query for mini game bets (from transactions)
	miniGameQuery := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ?", input.UserID).
		Where("type = ?", "minigame_place").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Profile").Preload("Root").Preload("Parent")
		})

	// Apply filters for mini game bets
	if input.Status != "" && input.Status != "entire" {
		miniGameQuery = miniGameQuery.Where("status = ?", input.Status)
	}

	if input.DateFrom != "" {
		miniGameQuery = miniGameQuery.Where("created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		miniGameQuery = miniGameQuery.Where("created_at <= ?", input.DateTo)
	}

	// Get total count for mini game bets
	var miniGameTotal int64
	if err := miniGameQuery.Count(&miniGameTotal).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated mini game transactions
	var miniGameTransactions []models.Transaction
	if err := miniGameQuery.
		Order("created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&miniGameTransactions).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Map transactions to mini game bets format
	type MiniGameBet struct {
		ID            uint        `json:"id"`
		Type          string      `json:"type"`
		UserID        uint        `json:"userId"`
		GameID        uint        `json:"gameId"`
		Amount        float64     `json:"amount"`
		Status        string      `json:"status"`
		GameName      string      `json:"gameName"`
		TransID       string      `json:"transId"`
		WinningAmount float64     `json:"winningAmount"`
		BettingTime   uint        `json:"bettingTime"`
		Details       interface{} `json:"details"`
		BeforeAmount  float64     `json:"beforeAmount"`
		AfterAmount   float64     `json:"afterAmount"`
		CreatedAt     time.Time   `json:"createdAt"`
		UpdatedAt     time.Time   `json:"updatedAt"`
	}

	var miniGameBets []MiniGameBet
	for _, tx := range miniGameTransactions {
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
		"message": "User betting history retrieved successfully",
		"status":  true,
		"data": gin.H{
			"casinoBets":    casinoBets,
			"slotBets":      slotBets,
			"miniGameBets":  miniGameBets,
			"casinoTotal":   casinoTotal,
			"slotTotal":     slotTotal,
			"miniGameTotal": miniGameTotal,
			"totalRecords":  casinoTotal + slotTotal + miniGameTotal,
		},
	})
}
