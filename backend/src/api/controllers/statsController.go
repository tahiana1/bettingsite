package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetStats provides dashboard statistics: today's deposit/withdraw, total balance/points, and today's winners
func GetStats(c *gin.Context) {
	today := time.Now().Truncate(24 * time.Hour)
	now := time.Now()

	// 1. Today's deposit amount (approved only)
	var depositToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ? AND DATE(approved_at) = ?", "deposit", "approved", today.Format("2006-01-02")).
		Select("COALESCE(SUM(amount),0)").
		Scan(&depositToday)

	// 2. Today's withdraw amount (approved only)
	var withdrawToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ? AND DATE(approved_at) = ?", "withdrawal", "approved", today.Format("2006-01-02")).
		Select("COALESCE(SUM(amount),0)").
		Scan(&withdrawToday)

	// 3. Total balance and points of all users
	var totalBalance float64
	var totalPoints int64
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(balance),0)").Scan(&totalBalance)
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(point),0)").Scan(&totalPoints)

	// 4. Count today's winners on bet (status = 'won' and settled today)
	var todayWinners int64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(settled_at) = ?", "won", today.Format("2006-01-02")).
		Count(&todayWinners)

	c.JSON(http.StatusOK, gin.H{
		"depositToday":  depositToday,
		"withdrawToday": withdrawToday,
		"totalBalance":  totalBalance,
		"totalPoints":   totalPoints,
		"todayWinners":  todayWinners,
		"now":           now,
	})
}
