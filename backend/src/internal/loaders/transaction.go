package loaders

// import vikstrous/dataloadgen with your other imports
import (
	"context"
	"fmt"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// transactionReader reads Transactions from a database
type transactionReader struct {
	db *gorm.DB
}

// getTransactions implements a batch function that can retrieve many transactions by ID,
// for use in a dataloader
func (u *transactionReader) getTransactions(ctx context.Context, nIDs []uint) ([]*models.Transaction, []error) {
	var transactions []*models.Transaction
	err := u.db.Where("id IN ?", nIDs).Find(&transactions).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	transactionMap := make(map[uint]*models.Transaction, len(transactions))
	for _, transaction := range transactions {
		transactionMap[transaction.ID] = transaction
	}

	// Match order of input IDs
	result := make([]*models.Transaction, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := transactionMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("transaction not found: %d", id)
		}
	}

	return result, errs
}

func (br *transactionReader) getTransactionsByTransactionID(ctx context.Context, nIDs []uint) ([]*models.Transaction, []error) {
	var transactions []*models.Transaction
	err := br.db.Where("transaction_id IN ?", nIDs).Find(&transactions).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map transaction_id to transaction
	transactionMap := make(map[uint]*models.Transaction, len(transactions))
	for _, n := range transactions {
		transactionMap[n.ID] = n
	}

	results := make([]*models.Transaction, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := transactionMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no transaction found for transaction_id: %d", uid)
		}
	}
	return results, errors
}

// GetTransaction returns single transaction by id efficiently
func GetTransaction(ctx context.Context, transactionID uint) (*models.Transaction, error) {
	loaders := For(ctx)
	return loaders.TransactionLoader.Load(ctx, transactionID)
}

// GetTransactions returns many transactions by ids efficiently
func (br *transactionReader) GetTransactions(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.TransactionList, error) {
	var transactions []*models.Transaction

	db := br.db.Model(&models.Transaction{}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Profile").Preload("Root").Preload("Parent")
	}).
		Joins("JOIN profiles ON transactions.user_id = profiles.user_id").
		Joins("JOIN users on transactions.user_id = users.id").
		Order("transactions.created_at DESC")

	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&transactions).Error; err != nil {
		return nil, err
	}
	return &model.TransactionList{
		Transactions: transactions,
		Total:        int32(count),
	}, nil
}

// CreateTransaction updates a transaction by ID
func (br *transactionReader) CreateTransaction(ctx context.Context, updates model.NewTransactionInput) (*models.Transaction, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	transaction := models.Transaction{
		UserID: updates.UserID,
	}

	if updates.Amount != nil {
		transaction.Amount = *updates.Amount
	}

	if updates.BalanceBefore != nil {
		transaction.BalanceBefore = *updates.BalanceBefore
	}

	if updates.BalanceAfter != nil {
		transaction.BalanceAfter = *updates.BalanceAfter
	}

	if err := br.db.Save(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

// UpdateTransaction updates a transaction by ID
func (br *transactionReader) UpdateTransaction(ctx context.Context, nID uint, updates model.UpdateTransactionInput) (*models.Transaction, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	transaction := models.Transaction{}

	if err := initializers.DB.Model(&transaction).First(&transaction, nID).Error; err != nil {
		return nil, err
	}

	if updates.Amount != nil {
		transaction.Amount = *updates.Amount
	}

	if updates.Status != nil {
		transaction.Status = *updates.Status
	}

	br.db.Save(transaction)

	return &transaction, nil
}

// DeleteTransaction deletes a transaction by ID (soft delete if GORM soft delete is enabled)
func (br *transactionReader) DeleteTransaction(ctx context.Context, nid uint) (bool, error) {
	n := &models.Transaction{}
	err := br.db.Model(&models.Transaction{}).First(&n, nid).Error
	if err != nil {
		return false, err
	}
	if err := br.db.Delete(&models.Transaction{}, nid).Error; err != nil {
		return false, err
	}
	return true, nil
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *transactionReader) ApproveTransaction(ctx context.Context, id uint) (bool, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	tr := models.Transaction{}

	if err := initializers.DB.Model(&tr).First(&tr, "id = ?", id).Error; err != nil {
		return false, err
	}
	tr.Status = "A"

	tx := initializers.DB.Save(&tr)

	if tx.Error != nil {
		return false, tx.Error
	}

	// Get the user's profile to update balance
	profile := models.Profile{}
	if err := initializers.DB.Where("user_id = ?", tr.UserID).First(&profile).Error; err != nil {
		return false, err
	}

	// Update balance based on transaction type
	if tr.Type == "deposit" {
		profile.Balance += tr.Amount
	} else if tr.Type == "withdrawal" {
		if profile.Balance < tr.Amount {
			return false, fmt.Errorf("insufficient balance")
		}
		profile.Balance -= tr.Amount
	}

	// Save updated profile with bank ID to satisfy foreign key constraint
	if err := initializers.DB.Model(&profile).Updates(map[string]interface{}{
		"balance": profile.Balance,
	}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (pr *transactionReader) WaitingTransaction(ctx context.Context, id uint) (bool, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	tr := models.Transaction{}

	if err := initializers.DB.Model(&tr).First(&tr, "id = ?", id).Error; err != nil {
		return false, err
	}
	tr.Status = "W"

	tx := initializers.DB.Save(&tr)

	if tx.Error != nil {
		return false, tx.Error
	}
	return true, nil
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *transactionReader) BlockTransaction(ctx context.Context, id uint) (bool, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	tr := models.Transaction{}

	if err := initializers.DB.Model(&tr).First(&tr, "id = ?", id).Error; err != nil {
		return false, err
	}
	tr.Status = "B"

	tx := initializers.DB.Save(&tr)

	if tx.Error != nil {
		return false, tx.Error
	}
	return true, nil
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *transactionReader) CancelTransaction(ctx context.Context, id uint) (bool, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	tr := models.Transaction{}

	if err := initializers.DB.Model(&tr).First(&tr, "id = ?", id).Error; err != nil {
		return false, err
	}
	tr.Status = "C"

	tx := initializers.DB.Save(&tr)

	if tx.Error != nil {
		return false, tx.Error
	}
	return true, nil
}

// GetWeeklyLosingData returns weekly losing data aggregated by week
func (br *transactionReader) GetWeeklyLosingData(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.WeeklyLosingDataList, error) {
	// Raw SQL query to get weekly losing data aggregated by week
	query := `
		SELECT 
			DATE_TRUNC('week', t.created_at) as week_start,
			DATE_TRUNC('week', t.created_at) + INTERVAL '6 days' as week_end,
			'site' as site,
			COALESCE(p.name, '') as distributor_name,
			COALESCE(p.level, 0) as distributor_level,
			COALESCE(p.nickname, '') as nickname,
			COALESCE(p.holder_name, '') as depositor,
			COALESCE(u.userid, '') as alias,
			COUNT(CASE WHEN t.amount > 0 THEN 1 END) as total_bet,
			COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) as total_winner,
			COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) as total_losing_money,
			COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) as settlement_amount,
			MIN(t.created_at) as application_date,
			MAX(t.updated_at) as processing_date,
			'Processing completed' as situation,
			COUNT(DISTINCT t.user_id) as user_count
		FROM transactions t
		LEFT JOIN users u ON t.user_id = u.id
		LEFT JOIN profiles p ON u.id = p.user_id
		WHERE t.deleted_at IS NULL
		GROUP BY DATE_TRUNC('week', t.created_at), p.name, p.level, p.nickname, p.holder_name, u.userid
		ORDER BY week_start DESC
	`

	var results []struct {
		WeekStart        string  `gorm:"column:week_start"`
		WeekEnd          string  `gorm:"column:week_end"`
		Site             string  `gorm:"column:site"`
		DistributorName  string  `gorm:"column:distributor_name"`
		DistributorLevel int32   `gorm:"column:distributor_level"`
		Nickname         string  `gorm:"column:nickname"`
		Depositor        string  `gorm:"column:depositor"`
		Alias            string  `gorm:"column:alias"`
		TotalBet         float64 `gorm:"column:total_bet"`
		TotalWinner      float64 `gorm:"column:total_winner"`
		TotalLosingMoney float64 `gorm:"column:total_losing_money"`
		SettlementAmount float64 `gorm:"column:settlement_amount"`
		ApplicationDate  string  `gorm:"column:application_date"`
		ProcessingDate   string  `gorm:"column:processing_date"`
		Situation        string  `gorm:"column:situation"`
		UserCount        int32   `gorm:"column:user_count"`
	}

	// Execute the query
	if err := br.db.Raw(query).Scan(&results).Error; err != nil {
		return nil, err
	}

	// Convert to model format
	weeklyData := make([]*model.WeeklyLosingData, len(results))
	for i, result := range results {
		weeklyData[i] = &model.WeeklyLosingData{
			WeekStart:        result.WeekStart,
			WeekEnd:          result.WeekEnd,
			Site:             result.Site,
			DistributorID:    fmt.Sprintf("L%d", result.DistributorLevel),
			DistributorName:  result.DistributorName,
			DistributorLevel: result.DistributorLevel,
			Nickname:         result.Nickname,
			Depositor:        result.Depositor,
			Alias:            result.Alias,
			TotalBet:         result.TotalBet,
			TotalWinner:      result.TotalWinner,
			TotalLosingMoney: result.TotalLosingMoney,
			SettlementAmount: result.SettlementAmount,
			ApplicationDate:  result.ApplicationDate,
			ProcessingDate:   result.ProcessingDate,
			Situation:        result.Situation,
			UserCount:        result.UserCount,
		}
	}

	return &model.WeeklyLosingDataList{
		WeeklyLosingData: weeklyData,
		Total:            int32(len(results)),
	}, nil
}
