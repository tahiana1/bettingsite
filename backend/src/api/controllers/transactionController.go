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

func GetTransaction(c *gin.Context) {
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

func CreateTransaction(c *gin.Context) {
	var transactionInput struct {
		UserId    uint    `json:"userId" binding:"required,min=1"`
		Amount    float64 `json:"amount" binding:"required,min=1"`
		Type      string  `json:"type" binding:"required,oneof=deposit withdrawal point"`
		Explation string  `json:"explation" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&transactionInput); err != nil {
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

	// Get user's profile to check current balance
	var profile models.Profile
	if err := initializers.DB.Where("user_id = ?", transactionInput.UserId).First(&profile).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Calculate balance before and after
	balanceBefore := profile.Balance
	var balanceAfter float64

	if transactionInput.Type == "deposit" {
		balanceAfter = balanceBefore + transactionInput.Amount
	} else if transactionInput.Type == "withdrawal" {
		// Check if user has sufficient balance
		if balanceBefore < transactionInput.Amount {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient balance for withdrawal",
			})
			return
		}
		balanceAfter = balanceBefore - transactionInput.Amount
	}

	// Create transaction record
	transaction := models.Transaction{
		UserID:        transactionInput.UserId,
		Amount:        transactionInput.Amount,
		Type:          transactionInput.Type,
		Explation:     transactionInput.Explation,
		BalanceBefore: balanceBefore,
		BalanceAfter:  balanceAfter,
		Status:        "pending",
	}

	initializers.DB.Create(&transaction)

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction created successfully",
		"data": gin.H{
			"transaction": transaction,
			"newBalance":  balanceAfter,
			"status":      true,
		},
	})
}
