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

// bankReader reads Banks from a database
type bankReader struct {
	db *gorm.DB
}

// getBanks implements a batch function that can retrieve many banks by ID,
// for use in a dataloader
func (u *bankReader) getBanks(ctx context.Context, nIDs []uint) ([]*models.Bank, []error) {
	var banks []*models.Bank
	err := u.db.Where("id IN ?", nIDs).Find(&banks).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	bankMap := make(map[uint]*models.Bank, len(banks))
	for _, bank := range banks {
		bankMap[bank.ID] = bank
	}

	// Match order of input IDs
	result := make([]*models.Bank, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := bankMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("bank not found: %d", id)
		}
	}

	return result, errs
}

func (br *bankReader) getBanksByBankID(ctx context.Context, nIDs []uint) ([]*models.Bank, []error) {
	var banks []*models.Bank
	err := br.db.Where("bank_id IN ?", nIDs).Find(&banks).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map bank_id to bank
	bankMap := make(map[uint]*models.Bank, len(banks))
	for _, n := range banks {
		bankMap[n.ID] = n
	}

	results := make([]*models.Bank, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := bankMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no bank found for bank_id: %d", uid)
		}
	}
	return results, errors
}

// GetBank returns single bank by id efficiently
func GetBank(ctx context.Context, bankID uint) (*models.Bank, error) {
	loaders := For(ctx)
	return loaders.BankLoader.Load(ctx, bankID)
}

// GetBanks returns many banks by ids efficiently
func (br *bankReader) GetBanks(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.BankList, error) {
	var banks []*models.Bank

	db := br.db.Model(&models.Bank{})
	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	db = db.Order("order_num asc")

	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&banks).Error; err != nil {
		return nil, err
	}
	return &model.BankList{
		Banks: banks,
		Total: int32(count),
	}, nil
}

// CreateBank updates a bank by ID
func (br *bankReader) CreateBank(ctx context.Context, updates model.NewBankInput) (*models.Bank, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	bank := models.Bank{
		Name: updates.Name,
	}

	if updates.OrderNum != nil {
		bank.OrderNum = *updates.OrderNum
	}

	if updates.Status != nil {
		bank.Status = *updates.Status
	}
	fmt.Println(updates)

	if err := br.db.Save(&bank).Error; err != nil {
		return nil, err
	}

	return &bank, nil
}

// UpdateBank updates a bank by ID
func (br *bankReader) UpdateBank(ctx context.Context, nID uint, updates model.UpdateBankInput) (*models.Bank, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	bank := models.Bank{}

	if err := initializers.DB.Model(&bank).First(&bank, nID).Error; err != nil {
		return nil, err
	}

	if updates.Name != nil {
		bank.Name = *updates.Name
	}

	if updates.OrderNum != nil {
		bank.OrderNum = *updates.OrderNum
	}

	if updates.Status != nil {
		bank.Status = *updates.Status
	}

	br.db.Save(bank)

	return &bank, nil
}

// DeleteBank deletes a bank by ID (soft delete if GORM soft delete is enabled)
func (br *bankReader) DeleteBank(ctx context.Context, nid uint) (bool, error) {
	n := &models.Bank{}
	err := br.db.Model(&models.Bank{}).First(&n, nid).Error
	if err != nil {
		return false, err
	}
	if err := br.db.Delete(&models.Bank{}, nid).Error; err != nil {
		return false, err
	}
	return true, nil
}
