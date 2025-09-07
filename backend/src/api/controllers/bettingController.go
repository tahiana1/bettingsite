package controllers

import (
	"net/http"
	"sort"
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

	// Build query with preloads
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

	if input.Status != "" {
		query = query.Where("casino_bets.status = ?", input.Status)
	}

	if input.DateFrom != "" {
		query = query.Where("casino_bets.created_at >= ?", input.DateFrom)
	}

	if input.DateTo != "" {
		query = query.Where("casino_bets.created_at <= ?", input.DateTo)
	}

	// Get total count for pagination
	var total int64
	if err := query.Count(&total).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get paginated casino bets
	var casinoBets []models.CasinoBet
	if err := query.
		Order("casino_bets.created_at DESC").
		Limit(input.Limit).
		Offset(input.Offset).
		Find(&casinoBets).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Casino Bets retrieved successfully",
		"status":  true,
		"data":    casinoBets,
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
