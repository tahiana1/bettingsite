package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// CommentOnPost comments on a post
func ConvertPoint(c *gin.Context) {
	// Get data from request
	var userInput struct {
		Id     uint    `json:"id" binding:"required,min=1"`
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

	// Fetch and validate the transaction record exists
	var transaction models.Transaction
	if err := tx.Where("id = ?", userInput.Id).First(&transaction).Error; err != nil {
		tx.Rollback()
		format_errors.NotFound(c, err)
		return
	}

	// Validate transaction is in pending status
	if transaction.Status != "pending" {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Transaction is not in pending status",
		})
		return
	}

	// Fetch and validate the user profile exists
	var profile models.Profile
	if err := tx.Where("user_id = ?", userInput.UserId).First(&profile).Error; err != nil {
		tx.Rollback()
		format_errors.NotFound(c, err)
		return
	}

	// Validate user has sufficient points for conversion
	if float64(profile.Point) < userInput.Amount {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Insufficient points for conversion",
		})
		return
	}

	// Update profile: subtract points and add to balance
	pointsBefore := profile.Point
	balanceBefore := profile.Balance

	newPoints := float64(profile.Point) - userInput.Amount
	newBalance := profile.Balance + userInput.Amount

	if err := tx.Model(&profile).Updates(models.Profile{
		Point:   int32(newPoints),
		Balance: newBalance,
	}).Error; err != nil {
		tx.Rollback()
		format_errors.InternalServerError(c, err)
		return
	}

	// Update transaction status from 'pending' to 'A' and add balance tracking
	if err := tx.Model(&transaction).Updates(models.Transaction{
		Status:        "A",
		BalanceBefore: balanceBefore,
		BalanceAfter:  newBalance,
		PointBefore:   float64(pointsBefore),
		PointAfter:    newPoints,
	}).Error; err != nil {
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
		"message": "Points converted to balance successfully",
		"data": gin.H{
			"transaction_id": userInput.Id,
			"user_id":        userInput.UserId,
			"points_before":  pointsBefore,
			"points_after":   int32(newPoints),
			"balance_before": balanceBefore,
			"balance_after":  newBalance,
			"amount":         userInput.Amount,
		},
	})
}
