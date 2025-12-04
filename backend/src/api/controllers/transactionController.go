package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	adminControllers "github.com/hotbrainy/go-betting/backend/api/controllers/admin"
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
		Type      string  `json:"type" binding:"required,oneof=deposit withdrawal point rollingExchange"`
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
	var pointBefore float64
	var pointAfter float64

	if transactionInput.Type == "deposit" {
		balanceAfter = balanceBefore + transactionInput.Amount
		pointAfter = float64(profile.Point)
		pointBefore = float64(profile.Point)
	} else if transactionInput.Type == "withdrawal" {
		// Check if user has sufficient balance
		if balanceBefore < transactionInput.Amount {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient balance for withdrawal",
			})
			return
		}
		balanceAfter = balanceBefore - transactionInput.Amount
		pointAfter = float64(profile.Point)
		pointBefore = float64(profile.Point)
	} else if transactionInput.Type == "point" {
		pointBefore = float64(profile.Point)
		pointAfter = pointBefore - transactionInput.Amount
		balanceAfter = balanceBefore + transactionInput.Amount
		balanceBefore = profile.Balance
	} else if transactionInput.Type == "rollingExchange" {
		// Check if user has sufficient rolling
		if profile.Roll < transactionInput.Amount {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient rolling for conversion",
			})
			return
		}
		// For rolling exchange, PointBefore/PointAfter represent rolling before/after
		pointBefore = profile.Roll
		pointAfter = profile.Roll - transactionInput.Amount
		balanceAfter = balanceBefore + transactionInput.Amount
		balanceBefore = profile.Balance
	}

	// Create transaction record
	transaction := models.Transaction{
		UserID:        transactionInput.UserId,
		Amount:        transactionInput.Amount,
		Type:          transactionInput.Type,
		Explation:     transactionInput.Explation,
		BalanceBefore: balanceBefore,
		BalanceAfter:  balanceAfter,
		PointBefore:   pointBefore,
		PointAfter:    pointAfter,
		Status:        "pending",
	}

	initializers.DB.Create(&transaction)

	// Create alert for admin
	var user models.User
	if err := initializers.DB.First(&user, transactionInput.UserId).Error; err == nil {
		var alertType, title, message, redirectURL string
		switch transactionInput.Type {
		case "deposit":
			alertType = "deposit"
			title = "New Deposit Request"
			message = fmt.Sprintf("User %s (ID: %d) requested a deposit of %.2f", user.Userid, user.ID, transactionInput.Amount)
		case "withdrawal":
			alertType = "withdrawal"
			title = "New Withdrawal Request"
			message = fmt.Sprintf("User %s (ID: %d) requested a withdrawal of %.2f", user.Userid, user.ID, transactionInput.Amount)
		case "point":
			alertType = "point"
			title = "New Point Conversion Request"
			message = fmt.Sprintf("User %s (ID: %d) requested to convert %.2f points to balance", user.Userid, user.ID, transactionInput.Amount)
		case "rollingExchange":
			alertType = "rollingExchange"
			title = "New Rolling Conversion Request"
			message = fmt.Sprintf("User %s (ID: %d) requested to convert %.2f rolling to balance", user.Userid, user.ID, transactionInput.Amount)
		}
		
		// Set redirect URL based on user role
		if alertType != "" {
			if user.Role == "A" || user.Role == "P" {
				redirectURL = "/admin/financals/general"
			} else {
				redirectURL = "/admin/financals/memberdwhistory"
			}
			adminControllers.CreateAlert(alertType, title, message, transaction.ID, redirectURL)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction created successfully",
		"data": gin.H{
			"transaction": transaction,
			"newBalance":  balanceAfter,
			"status":      true,
		},
	})
}
