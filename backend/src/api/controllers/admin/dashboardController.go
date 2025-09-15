package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	dashboardModels "github.com/hotbrainy/go-betting/backend/models"
)

// GetDashboard fetches all dashboard data
func GetDashboard(c *gin.Context) {
	// Get today's date for filtering
	today := time.Now().Format("2006-01-02")

	// Initialize response
	response := dashboardModels.DashboardResponse{}

	// Get today's statistics
	var stats dashboardModels.DashboardStats

	// Debug: Print today's date
	fmt.Printf("Today's date for filtering: %s\n", today)
	// First query for transaction statistics
	if err := initializers.DB.Raw(`
		WITH transaction_stats AS (
			SELECT 
				COALESCE(SUM(CASE WHEN t.type = 'deposit' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as deposit_amount,
				COALESCE(SUM(CASE WHEN t.type = 'withdrawal' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as withdraw_amount,
				COALESCE(SUM(CASE WHEN t.type = 'deposit' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as member_deposit_amount,
				COALESCE(SUM(CASE WHEN t.type = 'withdrawal' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as  member_withdraw_amount,
				COALESCE(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE 0 END), 0) as total_deposit_amount,
				COALESCE(SUM(CASE WHEN t.type = 'withdrawal' THEN t.amount ELSE 0 END), 0) as total_withdraw_amount,
				COALESCE(SUM(CASE WHEN t.status = 'settled' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as total_settlement,
				COALESCE(SUM(CASE WHEN t.type = 'betting/placingBet' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as betting_amount,
				COALESCE(SUM(CASE WHEN t.type = 'betSettlement' AND DATE(t.created_at AT TIME ZONE 'UTC') = ? THEN t.amount ELSE 0 END), 0) as prize_amount
			FROM transactions t
			LEFT JOIN users u ON t.user_id = u.id
		)
		SELECT * FROM transaction_stats
	`, today, today, today, today, today, today, today).Scan(&stats).Error; err != nil {
		fmt.Printf("Error in transaction stats query: %v\n", err)
		format_errors.InternalServerError(c, err)
		return
	}

	// Debug: Print transaction stats
	fmt.Printf("Transaction Stats: %+v\n", stats)

	// Second query for user statistics
	var userStats struct {
		BettingUsers     int64 `gorm:"column:betting_users"`
		RegisteredUsers  int64 `gorm:"column:registered_users"`
		NumberOfVisiters int64 `gorm:"column:number_of_visiters"`
	}

	if err := initializers.DB.Raw(`
		WITH user_stats AS (
			SELECT 
				COUNT(DISTINCT CASE WHEN DATE(t.created_at AT TIME ZONE 'UTC') = ? AND t.type = 'betting/placingBet' THEN t.user_id END) as betting_users,
				COUNT(DISTINCT CASE WHEN DATE(u.created_at AT TIME ZONE 'UTC') = ? THEN u.id END) as registered_users,
				COUNT(DISTINCT CASE WHEN DATE(u.updated_at AT TIME ZONE 'UTC') = ? THEN u.id END) as number_of_visiters
			FROM users u
			LEFT JOIN transactions t ON u.id = t.user_id
		)
		SELECT * FROM user_stats
	`, today, today, today).Scan(&userStats).Error; err != nil {
		fmt.Printf("Error in user stats query: %v\n", err)
		format_errors.InternalServerError(c, err)
		return
	}

	// Debug: Print user stats
	fmt.Printf("User Stats: %+v\n", userStats)

	// Update the stats with user statistics
	stats.BettingUsers = int(userStats.BettingUsers)
	stats.RegisteredUsers = int(userStats.RegisteredUsers)
	stats.NumberOfVisiters = int(userStats.NumberOfVisiters)

	// Calculate additional fields for admin layout
	// 1. Today's deposit amount (approved only)
	var depositToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ? AND DATE(transaction_at) = ?", "deposit", "A", today).
		Select("COALESCE(SUM(amount),0)").
		Scan(&depositToday)

	// 2. Today's withdraw amount (approved only)
	var withdrawToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ? AND DATE(transaction_at) = ?", "withdrawal", "A", today).
		Select("COALESCE(SUM(amount),0)").
		Scan(&withdrawToday)

	// 3. Total balance and points of all users
	var totalBalance float64
	var totalPoints int64
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(balance),0)").Scan(&totalBalance)
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(point),0)").Scan(&totalPoints)

	// 3.1. Rolling total: sum of all roll items in the profile table
	var rollingTotal float64
	initializers.DB.Model(&models.Profile{}).Select("COALESCE(SUM(roll),0)").Scan(&rollingTotal)

	// 4. Count today's winners on bet (status = 'won' and settled today)
	var todayWinners int64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(settled_at) = ?", "won", today).
		Count(&todayWinners)

	// 5. bettingToday: Absolute value of the sum of amounts from transactions with type "Rolling" for today
	var bettingToday float64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", "Rolling", today).
		Select("COALESCE(ABS(SUM(amount)),0)").
		Scan(&bettingToday)

	// 6. totalLoss: Total stake of lost bets settled today
	var totalLoss float64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(settled_at) = ?", "lost", today).
		Select("COALESCE(SUM(stake),0)").
		Scan(&totalLoss)

	// 7. totalSalesLossToday: Alias for totalLoss
	totalSalesLossToday := totalLoss

	// 8. todaysDistributionRolling: Total stake of all bets placed today (or use a specific transaction type if you have one)
	todaysDistributionRolling := bettingToday

	// 9. sportsPendingBetting: Count of bets with status 'pending' placed today
	var sportsPendingBetting int64
	initializers.DB.Model(&models.Bet{}).
		Where("status = ? AND DATE(placed_at) = ?", "pending", today).
		Count(&sportsPendingBetting)

	// 10. sportsRebateBetting: Placeholder (set to 0 or implement if you have logic)
	sportsRebateBetting := int64(0)

	// Update stats with additional fields
	stats.DepositToday = depositToday
	stats.WithdrawToday = withdrawToday
	stats.TotalBalance = totalBalance
	stats.TotalPoints = totalPoints
	stats.TodayWinners = todayWinners
	stats.BettingToday = bettingToday
	stats.TotalLoss = totalLoss
	stats.TotalSalesLossToday = totalSalesLossToday
	stats.TodaysDistributionRolling = todaysDistributionRolling
	stats.SportsPendingBetting = sportsPendingBetting
	stats.SportsRebateBetting = sportsRebateBetting
	stats.RollingTotal = rollingTotal

	// Debug: Print final stats
	fmt.Printf("Final Stats: %+v\n", stats)

	response.Stats = stats

	// Get division summary for last 4 days, this month, and last month
	var divisionSummaries []dashboardModels.DivisionSummary

	dates := []string{}
	for i := 0; i < 4; i++ {
		d := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		dates = append(dates, d)
	}

	// Last 4 days
	for _, d := range dates {
		var summary dashboardModels.DivisionSummary
		if err := initializers.DB.Raw(`
			SELECT
				? as division,
				COUNT(CASE WHEN t.type = 'deposit' THEN 1 END) as number_of_deposit,
				COUNT(CASE WHEN t.type = 'withdrawal' THEN 1 END) as number_of_withdraw,
				COUNT(CASE WHEN t.status = 'settled' THEN 1 END) as number_of_settlement,
				COALESCE(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE -t.amount END),0) as deposit_withdraw,
				COUNT(CASE WHEN t.type = 'bet' THEN 1 END) as number_of_bets,
				COUNT(CASE WHEN t.type = 'betSettlement' THEN 1 END) as number_of_win,
				COALESCE(SUM(CASE 
					WHEN t.type = 'bet' THEN t.amount 
					WHEN t.type = 'betSettlement' THEN -t.amount 
					ELSE 0 
				END),0) as betting_winning,
				COUNT(DISTINCT t.user_id) as number_of_members,
				COUNT(DISTINCT CASE WHEN t.type = 'bet' THEN t.user_id END) as number_of_betting_users,
				COUNT(DISTINCT u.id) as number_of_visiters
			FROM transactions t
			LEFT JOIN users u ON t.user_id = u.id
			WHERE DATE(t.created_at AT TIME ZONE 'UTC') = ?
		`, d, d).Scan(&summary).Error; err == nil {
			divisionSummaries = append(divisionSummaries, summary)
		}
	}

	// This month
	var summaryThisMonth dashboardModels.DivisionSummary
	firstOfMonth := time.Now().Format("2006-01") + "-01"
	if err := initializers.DB.Raw(`
		SELECT
			'This month' as division,
			COUNT(CASE WHEN t.type = 'deposit' THEN 1 END) as number_of_deposit,
			COUNT(CASE WHEN t.type = 'withdrawal' THEN 1 END) as number_of_withdraw,
			COUNT(CASE WHEN t.status = 'settled' THEN 1 END) as number_of_settlement,
			COALESCE(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE -t.amount END),0) as deposit_withdraw,
			COUNT(CASE WHEN t.type = 'bet' THEN 1 END) as number_of_bets,
			COUNT(CASE WHEN t.type = 'betSettlement' THEN 1 END) as number_of_win,
			COALESCE(SUM(CASE 
				WHEN t.type = 'bet' THEN t.amount 
				WHEN t.type = 'betSettlement' THEN -t.amount 
				ELSE 0 
			END),0) as betting_winning,
			COUNT(DISTINCT t.user_id) as number_of_members,
			COUNT(DISTINCT CASE WHEN t.type = 'bet' THEN t.user_id END) as number_of_betting_users,
			COUNT(DISTINCT u.id) as number_of_visiters
		FROM transactions t
		LEFT JOIN users u ON t.user_id = u.id
		WHERE t.created_at >= ? AND t.created_at < ?
	`, firstOfMonth, time.Now().AddDate(0, 1, -time.Now().Day()+1).Format("2006-01-02")).Scan(&summaryThisMonth).Error; err == nil {
		divisionSummaries = append(divisionSummaries, summaryThisMonth)
	}

	// Last month
	var summaryLastMonth dashboardModels.DivisionSummary
	firstOfLastMonth := time.Now().AddDate(0, -1, -time.Now().Day()+1).Format("2006-01-02")
	firstOfThisMonth := time.Now().Format("2006-01") + "-01"
	if err := initializers.DB.Raw(`
		SELECT
			'Last month' as division,
			COUNT(CASE WHEN t.type = 'deposit' THEN 1 END) as number_of_deposit,
			COUNT(CASE WHEN t.type = 'withdrawal' THEN 1 END) as number_of_withdraw,
			COUNT(CASE WHEN t.status = 'settled' THEN 1 END) as number_of_settlement,
			COALESCE(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE -t.amount END),0) as deposit_withdraw,
			COUNT(CASE WHEN t.type = 'bet' THEN 1 END) as number_of_bets,
			COUNT(CASE WHEN t.type = 'betSettlement' THEN 1 END) as number_of_win,
			COALESCE(SUM(CASE 
				WHEN t.type = 'bet' THEN t.amount 
				WHEN t.type = 'betSettlement' THEN -t.amount 
				ELSE 0 
			END),0) as betting_winning,
			COUNT(DISTINCT t.user_id) as number_of_members,
			COUNT(DISTINCT CASE WHEN t.type = 'bet' THEN t.user_id END) as number_of_betting_users,
			COUNT(DISTINCT u.id) as number_of_visiters
		FROM transactions t
		LEFT JOIN users u ON t.user_id = u.id
		WHERE t.created_at >= ? AND t.created_at < ?
	`, firstOfLastMonth, firstOfThisMonth).Scan(&summaryLastMonth).Error; err == nil {
		divisionSummaries = append(divisionSummaries, summaryLastMonth)
	}

	response.DivisionSummary = divisionSummaries

	// Get recent payments
	var recentPayments []dashboardModels.PaymentTransaction
	if err := initializers.DB.Raw(`
		SELECT 
			ROW_NUMBER() OVER (ORDER BY t.created_at DESC) as number,
			t.type,
			u.name,
			COALESCE(p.nickname, '-') as allas,
			COALESCE(t.explation, '-') as depositor,
			t.balance_before as before_amount,
			t.amount as processing_amount,
			t.balance_after as after_amount,
			TO_CHAR(t.transaction_at, 'YYYY-MM-DD HH24:MI:SS') as application_date,
			TO_CHAR(t.approved_at, 'YYYY-MM-DD HH24:MI:SS') as process_date
		FROM transactions t
		JOIN users u ON t.user_id = u.id
		LEFT JOIN profiles p ON u.id = p.user_id
		WHERE t.type IN ('deposit', 'withdrawal')
		ORDER BY t.created_at DESC
		LIMIT 8
	`).Scan(&recentPayments).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	response.RecentPayments = recentPayments

	// Get deposit/withdraw chart data
	var depositChart []dashboardModels.ChartData
	if err := initializers.DB.Raw(`
		WITH date_series AS (
			SELECT generate_series(
				CURRENT_DATE - INTERVAL '3 days',
				CURRENT_DATE,
				'1 day'::interval
			)::date as date
		),
		transaction_types AS (
			SELECT unnest(ARRAY['deposit', 'withdrawal']) as type
		)
		SELECT 
			TO_CHAR(ds.date, 'MM/DD') as name,
			tt.type as action,
			COALESCE(SUM(t.amount), 0) as pv
		FROM date_series ds
		CROSS JOIN transaction_types tt
		LEFT JOIN transactions t ON 
			DATE(t.created_at) = ds.date AND 
			t.type = tt.type
		GROUP BY ds.date, tt.type
		ORDER BY ds.date, tt.type
	`).Scan(&depositChart).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	response.DepositChart = depositChart

	// Get betting/winning chart data
	var bettingChart []dashboardModels.ChartData
	if err := initializers.DB.Raw(`
		WITH date_series AS (
			SELECT generate_series(
				CURRENT_DATE - INTERVAL '3 days',
				CURRENT_DATE,
				'1 day'::interval
			)::date as date
		)
		SELECT 
			TO_CHAR(ds.date, 'MM/DD') as name,
			'bet' as action,
			COALESCE(SUM(CASE 
				WHEN t.type = 'betting/placingBet' 
				AND DATE(t.created_at AT TIME ZONE 'UTC') = ds.date 
				THEN t.amount 
				ELSE 0 
			END), 0) as pv
		FROM date_series ds
		LEFT JOIN transactions t ON DATE(t.created_at AT TIME ZONE 'UTC') = ds.date
		GROUP BY ds.date
		UNION ALL
		SELECT 
			TO_CHAR(ds.date, 'MM/DD') as name,
			'profit_loss' as action,
			COALESCE(SUM(CASE 
				WHEN t.type = 'betting/placingBet' AND DATE(t.created_at AT TIME ZONE 'UTC') = ds.date THEN t.amount 
				ELSE 0 
			END), 0) as pv
		FROM date_series ds
		LEFT JOIN transactions t ON DATE(t.created_at AT TIME ZONE 'UTC') = ds.date
		GROUP BY ds.date
		ORDER BY name, action
	`).Scan(&bettingChart).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Add debug logging
	fmt.Printf("Betting Chart Data: %+v\n", bettingChart)

	response.BettingChart = bettingChart

	// Additional queries for admin header tags
	// 11. Connected users (users who logged in today)
	var connectedUsers int64
	initializers.DB.Model(&models.User{}).
		Where("DATE(updated_at) = ?", today).
		Count(&connectedUsers)

	// 12. Today's subscribers (new users registered today)
	var todaysSubscribers int64
	initializers.DB.Model(&models.User{}).
		Where("DATE(created_at) = ?", today).
		Count(&todaysSubscribers)

	// 13. Today's withdrawal count
	var todaysWithdrawal int64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", "withdrawal", today).
		Count(&todaysWithdrawal)

	var registeredUsers int64
	initializers.DB.Model(&models.User{}).Where("status = ?", "P").Count(&registeredUsers)

	// 14. Total registered users count (only pending users)
	var registeredUsersCount int64
	initializers.DB.Model(&models.User{}).Where("status = ?", "A").Count(&registeredUsersCount)

	// 15. First deposit count (users who made their first deposit today)
	var firstDeposit int64
	initializers.DB.Raw(`
		SELECT COUNT(DISTINCT t.user_id) 
		FROM transactions t 
		WHERE t.type = 'deposit' 
		AND DATE(t.created_at AT TIME ZONE 'UTC') = ? 
		AND t.user_id NOT IN (
			SELECT DISTINCT user_id 
			FROM transactions 
			WHERE type = 'deposit' 
			AND DATE(created_at AT TIME ZONE 'UTC') < ?
		)
	`, today, today).Scan(&firstDeposit)

	// 16. Number of login failures today
	var numberOfLoginFailures int64
	// This would need a login_attempts table or similar - for now set to 0
	numberOfLoginFailures = 0

	// 17. Number of unprocessed deposit requests
	var numberOfDepositorsToday int64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ?", "deposit", "pending").
		Count(&numberOfDepositorsToday)

	// 18. Number of withdrawal users today
	var numberOfWithdrawalToday int64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ?", "withdrawal", "pending").
		Count(&numberOfWithdrawalToday)

	// 19. Number of betting members today
	var numberOfBettingMembersToday int64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", "betting/placingBet", today).
		Distinct("user_id").
		Count(&numberOfBettingMembersToday)

	// 20. Number of bets today
	var numberOfBetsToday int64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND DATE(created_at AT TIME ZONE 'UTC') = ?", "betting/placingBet", today).
		Count(&numberOfBetsToday)

	var membershipInquiry int64
	initializers.DB.Model(&models.Qna{}).
		Where("type = ? AND status = ?", "contact", "P").
		Count(&membershipInquiry)

	var rollingTransition int64
	initializers.DB.Model(&models.Transaction{}).
		Where("type = ? AND status = ?", "rollingExchange", "pending").
		Count(&rollingTransition)

	// 4.1. HonorLink balance
	var honorLinkBalance float64 = 0
	const (
		baseURL     = "https://api.honorlink.org/api"
		bearerToken = "srDiqct6lH61a0zHNKPUu0IwE0mg7Ht38sALu3oWb5bf8e9d"
	)

	// Make request to HonorLink API with proper error handling
	reqURL := fmt.Sprintf("%s/my-info", baseURL)

	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		fmt.Printf("Failed to create request: %v\n", err)
		honorLinkBalance = 0
	} else {
		req.Header.Set("Authorization", "Bearer "+bearerToken)
		req.Header.Set("Content-Type", "application/json")

		// Create HTTP client with timeout
		client := &http.Client{
			Timeout: 10 * time.Second,
		}

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("Failed to make request: %v\n", err)
			honorLinkBalance = 0
		} else {
			defer resp.Body.Close()

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				fmt.Printf("Failed to read response: %v\n", err)
				honorLinkBalance = 0
			} else if resp.StatusCode != 200 {
				fmt.Printf("Failed to get agent balance, status: %d, response: %s\n", resp.StatusCode, string(body))
				honorLinkBalance = 0
			} else {
				// Parse response to get balance
				var responseData map[string]interface{}
				if err := json.Unmarshal(body, &responseData); err != nil {
					fmt.Printf("Failed to parse response: %v\n", err)
					honorLinkBalance = 0
				} else {
					// Safely extract balance from response with type checking
					if balanceValue, exists := responseData["balance"]; exists {
						switch v := balanceValue.(type) {
						case float64:
							honorLinkBalance = v
						case int:
							honorLinkBalance = float64(v)
						case int64:
							honorLinkBalance = float64(v)
						case string:
							if parsed, err := fmt.Sscanf(v, "%f", &honorLinkBalance); err != nil || parsed != 1 {
								fmt.Printf("Failed to parse balance string: %v\n", err)
								honorLinkBalance = 0
							}
						default:
							fmt.Printf("Unexpected balance type: %T, value: %v\n", balanceValue, balanceValue)
							honorLinkBalance = 0
						}
						fmt.Printf("HonorLink balance: %f\n", honorLinkBalance)

					} else {
						fmt.Printf("Balance field not found in response\n")
						honorLinkBalance = 0
					}
				}
			}
		}
	}

	fmt.Println("honorLinkBalance", honorLinkBalance)

	// Update stats with additional fields
	response.Stats.ConnectedUsers = connectedUsers
	response.Stats.TodaysSubscribers = todaysSubscribers
	response.Stats.TodaysWithdrawal = todaysWithdrawal
	response.Stats.RegisteredUsersCount = registeredUsersCount
	response.Stats.RegisteredUsers = int(registeredUsers)
	response.Stats.FirstDeposit = firstDeposit
	response.Stats.NumberOfLoginFailures = numberOfLoginFailures
	response.Stats.NumberOfDepositorsToday = numberOfDepositorsToday
	response.Stats.NumberOfWithdrawalToday = numberOfWithdrawalToday
	response.Stats.NumberOfBettingMembersToday = numberOfBettingMembersToday
	response.Stats.NumberOfBetsToday = numberOfBetsToday
	response.Stats.HonorLinkBalance = honorLinkBalance
	response.Stats.MembershipInquiry = membershipInquiry
	response.Stats.RollingTransition = rollingTransition

	c.JSON(200, response)
}
