package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// Deposit the amount to balance then add the transaction table.
func Deposit(c *gin.Context) {
	// Get data from request
	var userInput struct {
		Amount float64 `json:"amount" binding:"required,min=0"`
		UserId uint    `json:"userId" binding:"required,min=1"`
	}

	err := c.ShouldBindJSON(&userInput)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Start database transaction to ensure atomicity
	tx := initializers.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Fetch and validate the user profile exists
	var profile models.Profile
	if err := tx.Where("user_id = ?", userInput.UserId).First(&profile).Error; err != nil {
		tx.Rollback()
		format_errors.NotFound(c, err)
		return
	}

	// Store balance before update
	balanceBefore := profile.Balance
	newBalance := profile.Balance + userInput.Amount

	// Update profile: add amount to balance
	if err := tx.Model(&profile).Update("balance", newBalance).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Create new transaction record
	transaction := models.Transaction{
		UserID:        userInput.UserId,
		Amount:        userInput.Amount,
		Type:          "directDeposit",
		Status:        "A",
		BalanceBefore: balanceBefore,
		BalanceAfter:  newBalance,
	}

	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Deposit successful",
		"data": gin.H{
			"transaction_id": transaction.ID,
			"user_id":        userInput.UserId,
			"balance_before": balanceBefore,
			"balance_after":  newBalance,
			"amount":         userInput.Amount,
		},
	})
}

func Withdrawal(c *gin.Context) {
	// Get data from request
	var userInput struct {
		Amount float64 `json:"amount" binding:"required,min=0"`
		UserId uint    `json:"userId" binding:"required,min=1"`
	}

	err := c.ShouldBindJSON(&userInput)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Start database transaction to ensure atomicity
	tx := initializers.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Fetch and validate the user profile exists
	var profile models.Profile
	if err := tx.Where("user_id = ?", userInput.UserId).First(&profile).Error; err != nil {
		tx.Rollback()
		format_errors.NotFound(c, err)
		return
	}

	// Validate user has sufficient balance for withdrawal
	if profile.Balance < userInput.Amount {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Insufficient balance for withdrawal",
		})
		return
	}

	// Store balance before update
	balanceBefore := profile.Balance
	newBalance := profile.Balance - userInput.Amount

	// Update profile: subtract amount from balance
	if err := tx.Model(&profile).Update("balance", newBalance).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Create new transaction record
	transaction := models.Transaction{
		UserID:        userInput.UserId,
		Amount:        userInput.Amount,
		Type:          "directWithdraw",
		Status:        "A",
		BalanceBefore: balanceBefore,
		BalanceAfter:  newBalance,
	}

	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Withdrawal successful",
		"data": gin.H{
			"transaction_id": transaction.ID,
			"user_id":        userInput.UserId,
			"balance_before": balanceBefore,
			"balance_after":  newBalance,
			"amount":         userInput.Amount,
		},
	})
}
