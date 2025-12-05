package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	dashboardModels "github.com/hotbrainy/go-betting/backend/models"
)

// GetPartnerDashboardStats returns dashboard statistics for the authenticated partner user
func GetPartnerDashboardStats(c *gin.Context) {
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

	// Load partner profile
	if err := initializers.DB.Preload("Profile").First(&partner, partner.ID).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get today's date for filtering
	today := time.Now().Format("2006-01-02")

	// Get all sub users (where parent_id = partner.ID)
	var subUserIDs []uint
	initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID).
		Pluck("id", &subUserIDs)

	fmt.Printf("🔍 Partner ID: %d, Found %d sub users: %v\n", partner.ID, len(subUserIDs), subUserIDs)

	// Include partner's own ID in the list for queries that need "this user and sub users"
	allUserIDs := append([]uint{partner.ID}, subUserIDs...)

	// 1. depositToday: sum on transaction table for this user and sub users (today, approved)
	var depositToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND status = ? AND DATE(transaction_at) = ?", allUserIDs, "deposit", "A", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&depositToday)

	// 2. withdrawlToday: sum on transaction table for this user and sub users (today, approved)
	var withdrawlToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND status = ? AND DATE(transaction_at) = ?", allUserIDs, "withdrawal", "A", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&withdrawlToday)

	// 3. bettingToday: sum on transaction table for this user and sub users (today)
	// Using type "betting/placingBet" for betting transactions
	var bettingToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betting/placingBet", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&bettingToday)

	// 4. todaysWinner: today's win sum on transaction table for this user only
	var todaysWinner float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", partner.ID, "betSettlement", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&todaysWinner)

	// 5. lowerHoldingAmount: sub users balance sum
	var lowerHoldingAmount float64
	if len(subUserIDs) > 0 {
		// Use JOIN to ensure we get profiles for sub users
		initializers.DB.Table("profiles").
			Joins("INNER JOIN users ON users.id = profiles.user_id").
			Where("users.parent_id = ?", partner.ID).
			Select("COALESCE(SUM(profiles.balance), 0)").
			Scan(&lowerHoldingAmount)

		fmt.Printf("💰 Lower holding amount (sub users balance sum): %f\n", lowerHoldingAmount)
	} else {
		fmt.Printf("⚠️ No sub users found for partner ID: %d\n", partner.ID)
	}

	// 6. myBalance: current user balance
	myBalance := partner.Profile.Balance

	// 7. point: current user point
	point := partner.Profile.Point

	// 8. today'sLossingMoney: today's losing money sum on bet table for this user and sub users
	var todaysLossingMoney float64
	if len(allUserIDs) > 0 {
		initializers.DB.Model(&models.Bet{}).
			Where("user_id IN ? AND status = ? AND DATE(settled_at) = ?", allUserIDs, "lost", today).
			Select("COALESCE(SUM(stake), 0)").
			Scan(&todaysLossingMoney)
	}

	// 9. today'sRollingGold: today's rolling gold sum on profile table for this user and sub users
	// Note: Rolling gold is typically updated in real-time, so we sum the current roll values
	// If you need today's changes only, you might need a transaction log for roll changes
	var todaysRollingGold float64
	if len(allUserIDs) > 0 {
		initializers.DB.Model(&models.Profile{}).
			Where("user_id IN ?", allUserIDs).
			Select("COALESCE(SUM(roll), 0)").
			Scan(&todaysRollingGold)
	}

	// Return the response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"stats": gin.H{
			"depositToday":       depositToday,
			"withdrawToday":      withdrawlToday,
			"bettingToday":       bettingToday,
			"todayWinners":       todaysWinner,
			"lowerHoldingAmount": lowerHoldingAmount,
			"myBalance":          myBalance,
			"point":              point,
			"todaysLossingMoney": todaysLossingMoney,
			"todaysRollingGold":  todaysRollingGold,
		},
	})
}

// GetPartnerDashboardData returns comprehensive dashboard data for partner management page
func GetPartnerDashboardData(c *gin.Context) {
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

	// Load partner profile
	if err := initializers.DB.Preload("Profile").First(&partner, partner.ID).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Get today's date for filtering
	today := time.Now().Format("2006-01-02")

	// Get all sub users (where parent_id = partner.ID)
	var subUserIDs []uint
	initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID).
		Pluck("id", &subUserIDs)

	// Include partner's own ID in the list for queries that need "this user and sub users"
	allUserIDs := append([]uint{partner.ID}, subUserIDs...)

	// ========== MY WALLET SECTION ==========
	// Amount held: sub users balance sum
	var amountHeld float64
	if len(subUserIDs) > 0 {
		initializers.DB.Table("profiles").
			Joins("INNER JOIN users ON users.id = profiles.user_id").
			Where("users.parent_id = ?", partner.ID).
			Select("COALESCE(SUM(profiles.balance), 0)").
			Scan(&amountHeld)
	}

	// Point: current user point
	point := partner.Profile.Point

	// Rolling gold: sum of roll values for this user and sub users
	var rollingGold float64
	if len(allUserIDs) > 0 {
		initializers.DB.Model(&models.Profile{}).
			Where("user_id IN ?", allUserIDs).
			Select("COALESCE(SUM(roll), 0)").
			Scan(&rollingGold)
	}

	// Losing money: today's losing money sum on bet table
	var losingMoney float64
	if len(allUserIDs) > 0 {
		initializers.DB.Model(&models.Bet{}).
			Where("user_id IN ? AND status = ? AND DATE(settled_at) = ?", allUserIDs, "lost", today).
			Select("COALESCE(SUM(stake), 0)").
			Scan(&losingMoney)
	}

	// ========== TODAY'S STATISTICS SECTION ==========
	// Deposit amount: today's deposits (approved)
	var depositAmount float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND status = ? AND DATE(transaction_at) = ?", allUserIDs, "deposit", "A", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&depositAmount)

	// Withdrawal amount: today's withdrawals (approved)
	var withdrawalAmount float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND status = ? AND DATE(transaction_at) = ?", allUserIDs, "withdrawal", "A", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&withdrawalAmount)

	// Deposit-Withdrawal: net difference
	depositWithdrawal := depositAmount - withdrawalAmount

	// Betting amount: today's betting
	var bettingAmount float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betting/placingBet", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&bettingAmount)

	// Winning amount: today's wins
	var winningAmount float64
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betSettlement", today).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&winningAmount)

	// Bet-Win: net difference
	betWin := bettingAmount - winningAmount

	// ========== SUMMARY SECTION ==========
	var divisionSummaries []dashboardModels.DivisionSummary

	// Get dates for last 4 days
	dates := []string{}
	for i := 0; i < 4; i++ {
		d := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		dates = append(dates, d)
	}

	// Last 4 days
	for _, d := range dates {
		var summary dashboardModels.DivisionSummary

		// Get counts and sums - create fresh queries for each
		var depositCount int64
		var withdrawCount int64
		var settlementCount int64
		var depositSum float64
		var withdrawSum float64
		var betCount int64
		var winCount int64
		var betSum float64
		var winSum float64
		var memberCount int64
		var bettingUserCount int64

		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "deposit", d).
			Count(&depositCount)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "withdrawal", d).
			Count(&withdrawCount)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND status = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "settled", d).
			Count(&settlementCount)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "deposit", d).
			Select("COALESCE(SUM(amount), 0)").Scan(&depositSum)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "withdrawal", d).
			Select("COALESCE(SUM(amount), 0)").Scan(&withdrawSum)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betting/placingBet", d).
			Count(&betCount)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betSettlement", d).
			Count(&winCount)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betting/placingBet", d).
			Select("COALESCE(SUM(amount), 0)").Scan(&betSum)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betSettlement", d).
			Select("COALESCE(SUM(amount), 0)").Scan(&winSum)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, d).
			Select("COUNT(DISTINCT user_id)").Scan(&memberCount)
		initializers.DB.Model(&models.Transaction{}).
			Where("user_id IN ? AND type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", allUserIDs, "betting/placingBet", d).
			Select("COUNT(DISTINCT user_id)").Scan(&bettingUserCount)

		// Format division as date string
		dateTime, _ := time.Parse("2006-01-02", d)
		summary.Division = dateTime.Format("January 2, 2006")
		summary.NumberOfDeposit = int(depositCount)
		summary.NumberOfWithdraw = int(withdrawCount)
		summary.NumberOfSettlement = int(settlementCount)
		summary.DepositWithdraw = depositSum - withdrawSum
		summary.NumberOfBets = int(betCount)
		summary.NumberOfWin = int(winCount)
		summary.BettingWinning = betSum - winSum
		summary.NumberOfMembers = int(memberCount)
		summary.NumberOfBettingUsers = int(bettingUserCount)
		summary.NumberOfVisiters = 0

		divisionSummaries = append(divisionSummaries, summary)
	}

	// This month
	var summaryThisMonth dashboardModels.DivisionSummary
	firstOfMonth := time.Now().Format("2006-01") + "-01"
	nextMonth := time.Now().AddDate(0, 1, 0).Format("2006-01") + "-01"

	var depositCount int64
	var withdrawCount int64
	var settlementCount int64
	var depositSum float64
	var withdrawSum float64
	var betCount int64
	var winCount int64
	var betSum float64
	var winSum float64
	var memberCount int64
	var bettingUserCount int64

	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "deposit", firstOfMonth, nextMonth).
		Count(&depositCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "withdrawal", firstOfMonth, nextMonth).
		Count(&withdrawCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND status = ? AND created_at >= ? AND created_at < ?", allUserIDs, "settled", firstOfMonth, nextMonth).
		Count(&settlementCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "deposit", firstOfMonth, nextMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&depositSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "withdrawal", firstOfMonth, nextMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&withdrawSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betting/placingBet", firstOfMonth, nextMonth).
		Count(&betCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betSettlement", firstOfMonth, nextMonth).
		Count(&winCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betting/placingBet", firstOfMonth, nextMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&betSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betSettlement", firstOfMonth, nextMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&winSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND created_at >= ? AND created_at < ?", allUserIDs, firstOfMonth, nextMonth).
		Select("COUNT(DISTINCT user_id)").Scan(&memberCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betting/placingBet", firstOfMonth, nextMonth).
		Select("COUNT(DISTINCT user_id)").Scan(&bettingUserCount)

	summaryThisMonth.Division = "This month"
	summaryThisMonth.NumberOfDeposit = int(depositCount)
	summaryThisMonth.NumberOfWithdraw = int(withdrawCount)
	summaryThisMonth.NumberOfSettlement = int(settlementCount)
	summaryThisMonth.DepositWithdraw = depositSum - withdrawSum
	summaryThisMonth.NumberOfBets = int(betCount)
	summaryThisMonth.NumberOfWin = int(winCount)
	summaryThisMonth.BettingWinning = betSum - winSum
	summaryThisMonth.NumberOfMembers = int(memberCount)
	summaryThisMonth.NumberOfBettingUsers = int(bettingUserCount)
	summaryThisMonth.NumberOfVisiters = 0
	divisionSummaries = append(divisionSummaries, summaryThisMonth)

	// Last month
	var summaryLastMonth dashboardModels.DivisionSummary
	firstOfLastMonth := time.Now().AddDate(0, -1, -time.Now().Day()+1).Format("2006-01-02")
	firstOfThisMonth := time.Now().Format("2006-01") + "-01"

	var lDepositCount int64
	var lWithdrawCount int64
	var lSettlementCount int64
	var lDepositSum float64
	var lWithdrawSum float64
	var lBetCount int64
	var lWinCount int64
	var lBetSum float64
	var lWinSum float64
	var lMemberCount int64
	var lBettingUserCount int64

	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "deposit", firstOfLastMonth, firstOfThisMonth).
		Count(&lDepositCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "withdrawal", firstOfLastMonth, firstOfThisMonth).
		Count(&lWithdrawCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND status = ? AND created_at >= ? AND created_at < ?", allUserIDs, "settled", firstOfLastMonth, firstOfThisMonth).
		Count(&lSettlementCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "deposit", firstOfLastMonth, firstOfThisMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&lDepositSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "withdrawal", firstOfLastMonth, firstOfThisMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&lWithdrawSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betting/placingBet", firstOfLastMonth, firstOfThisMonth).
		Count(&lBetCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betSettlement", firstOfLastMonth, firstOfThisMonth).
		Count(&lWinCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betting/placingBet", firstOfLastMonth, firstOfThisMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&lBetSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betSettlement", firstOfLastMonth, firstOfThisMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&lWinSum)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND created_at >= ? AND created_at < ?", allUserIDs, firstOfLastMonth, firstOfThisMonth).
		Select("COUNT(DISTINCT user_id)").Scan(&lMemberCount)
	initializers.DB.Model(&models.Transaction{}).
		Where("user_id IN ? AND type = ? AND created_at >= ? AND created_at < ?", allUserIDs, "betting/placingBet", firstOfLastMonth, firstOfThisMonth).
		Select("COUNT(DISTINCT user_id)").Scan(&lBettingUserCount)

	summaryLastMonth.Division = "Last month"
	summaryLastMonth.NumberOfDeposit = int(lDepositCount)
	summaryLastMonth.NumberOfWithdraw = int(lWithdrawCount)
	summaryLastMonth.NumberOfSettlement = int(lSettlementCount)
	summaryLastMonth.DepositWithdraw = lDepositSum - lWithdrawSum
	summaryLastMonth.NumberOfBets = int(lBetCount)
	summaryLastMonth.NumberOfWin = int(lWinCount)
	summaryLastMonth.BettingWinning = lBetSum - lWinSum
	summaryLastMonth.NumberOfMembers = int(lMemberCount)
	summaryLastMonth.NumberOfBettingUsers = int(lBettingUserCount)
	summaryLastMonth.NumberOfVisiters = 0
	divisionSummaries = append(divisionSummaries, summaryLastMonth)

	// ========== ADMIN NOTE SECTION (Inboxes) ==========
	type AdminNote struct {
		Number        int    `json:"number"`
		Title         string `json:"title"`
		TimeOfWriting string `json:"timeOfWriting"`
		Situation     string `json:"situation"`
	}

	var adminNotes []AdminNote
	if len(subUserIDs) > 0 {
		initializers.DB.Raw(`
			SELECT 
				ROW_NUMBER() OVER (ORDER BY i.created_at DESC) as number,
				i.title,
				TO_CHAR(i.created_at, 'YYYY-MM-DD HH24:MI:SS') as time_of_writing,
				CASE 
					WHEN i.status = true THEN 'Read'
					ELSE 'Unread'
				END as situation
			FROM inboxes i
			JOIN users u ON i.user_id = u.id
			WHERE u.parent_id = ?
			ORDER BY i.created_at DESC
			LIMIT 10
		`, partner.ID).Scan(&adminNotes)
	}

	// ========== CONTACT THE ADMINISTRATOR SECTION (QNAs) ==========
	type ContactAdmin struct {
		Number        int    `json:"number"`
		Title         string `json:"title"`
		TimeOfWriting string `json:"timeOfWriting"`
		Situation     string `json:"situation"`
	}

	var contactAdmins []ContactAdmin
	if len(subUserIDs) > 0 {
		initializers.DB.Raw(`
			SELECT 
				ROW_NUMBER() OVER (ORDER BY q.created_at DESC) as number,
				q.question_title as title,
				TO_CHAR(q.created_at, 'YYYY-MM-DD HH24:MI:SS') as time_of_writing,
				CASE 
					WHEN q.status = 'P' THEN 'Pending'
					WHEN q.status = 'A' THEN 'Answered'
					WHEN q.status = 'C' THEN 'Completed'
					ELSE q.status
				END as situation
			FROM qnas q
			JOIN users u ON q.user_id = u.id
			WHERE u.parent_id = ?
			ORDER BY q.created_at DESC
			LIMIT 10
		`, partner.ID).Scan(&contactAdmins)
	}

	// Return the response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"wallet": gin.H{
			"amountHeld":  amountHeld,
			"point":       point,
			"rollingGold": rollingGold,
			"losingMoney": losingMoney,
		},
		"todayStats": gin.H{
			"depositAmount":     depositAmount,
			"withdrawalAmount":  withdrawalAmount,
			"depositWithdrawal": depositWithdrawal,
			"bettingAmount":     bettingAmount,
			"winningAmount":     winningAmount,
			"betWin":            betWin,
		},
		"summary":      divisionSummaries,
		"adminNotes":   adminNotes,
		"contactAdmin": contactAdmins,
	})
}
