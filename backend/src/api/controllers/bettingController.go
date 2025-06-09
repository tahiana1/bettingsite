package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/validations"
)

func GetBetting(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Query("userid"), 10, 64)
	typeString := c.Query("type")
	transactions := []models.Transaction{}
	err := initializers.DB.
		Model(&models.Transaction{}).
		Where("user_id = ?", id).
		Where("type = ?", typeString).
		Order("id DESC").
		Find(&transactions).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	var profile models.Profile
	err = initializers.DB.
		Model(&models.Profile{}).
		Where("user_id = ?", id).
		First(&profile).Error

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction created successfully",
		"data":    transactions,
		"balance": profile.Balance,
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
