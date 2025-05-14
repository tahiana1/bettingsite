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

// smsApiReader reads SMSApis from a database
type smsApiReader struct {
	db *gorm.DB
}

// getSMSApis implements a batch function that can retrieve many smsApis by ID,
// for use in a dataloader
func (u *smsApiReader) getSMSApis(ctx context.Context, nIDs []uint) ([]*models.SMSApi, []error) {
	var smsApis []*models.SMSApi
	err := u.db.Where("id IN ?", nIDs).Find(&smsApis).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	smsApiMap := make(map[uint]*models.SMSApi, len(smsApis))
	for _, smsApi := range smsApis {
		smsApiMap[smsApi.ID] = smsApi
	}

	// Match order of input IDs
	result := make([]*models.SMSApi, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := smsApiMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("smsApi not found: %d", id)
		}
	}

	return result, errs
}

func (br *smsApiReader) getSMSApisBySMSApiID(ctx context.Context, nIDs []uint) ([]*models.SMSApi, []error) {
	var smsApis []*models.SMSApi
	err := br.db.Where("smsApi_id IN ?", nIDs).Find(&smsApis).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map smsApi_id to smsApi
	smsApiMap := make(map[uint]*models.SMSApi, len(smsApis))
	for _, n := range smsApis {
		smsApiMap[n.ID] = n
	}

	results := make([]*models.SMSApi, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := smsApiMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no smsApi found for smsApi_id: %d", uid)
		}
	}
	return results, errors
}

// GetSMSApi returns single smsApi by id efficiently
func GetSMSApi(ctx context.Context, smsApiID uint) (*models.SMSApi, error) {
	loaders := For(ctx)
	return loaders.SMSApiLoader.Load(ctx, smsApiID)
}

// GetSMSApis returns many smsApis by ids efficiently
func (br *smsApiReader) GetSMSApis(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.SMSApiList, error) {
	var smsApis []*models.SMSApi

	db := br.db.Model(&models.SMSApi{})
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

	if err := db.Find(&smsApis).Error; err != nil {
		return nil, err
	}
	return &model.SMSApiList{
		SmsApis: smsApis,
		Total:   int32(count),
	}, nil
}

// CreateSMSApi updates a smsApi by ID
func (br *smsApiReader) CreateSMSApi(ctx context.Context, updates model.NewSMSApiInput) (*models.SMSApi, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	smsApi := models.SMSApi{
		Name: updates.Name,
	}

	if updates.OrderNum != nil {
		smsApi.OrderNum = *updates.OrderNum
	}
	fmt.Println(updates)

	if err := br.db.Save(&smsApi).Error; err != nil {
		return nil, err
	}

	return &smsApi, nil
}

// UpdateSMSApi updates a smsApi by ID
func (br *smsApiReader) UpdateSMSApi(ctx context.Context, nID uint, updates model.UpdateSMSApiInput) (*models.SMSApi, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	smsApi := models.SMSApi{}

	if err := initializers.DB.Model(&smsApi).First(&smsApi, nID).Error; err != nil {
		return nil, err
	}

	if updates.Name != nil {
		smsApi.Name = *updates.Name
	}

	if updates.OrderNum != nil {
		smsApi.OrderNum = *updates.OrderNum
	}

	br.db.Save(smsApi)

	return &smsApi, nil
}

// DeleteSMSApi deletes a smsApi by ID (soft delete if GORM soft delete is enabled)
func (br *smsApiReader) DeleteSMSApi(ctx context.Context, nid uint) (bool, error) {
	n := &models.SMSApi{}
	err := br.db.Model(&models.SMSApi{}).First(&n, nid).Error
	if err != nil {
		return false, err
	}
	if err := br.db.Delete(&models.SMSApi{}, nid).Error; err != nil {
		return false, err
	}
	return true, nil
}
