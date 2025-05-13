package loaders

// import vikstrous/dataloadgen with your other imports
import (
	"context"
	"fmt"
	"time"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// adminPermissionReader reads AdminPermissions from a database
type adminPermissionReader struct {
	db *gorm.DB
}

// getAdminPermissions implements a batch function that can retrieve many adminPermissions by ID,
// for use in a dataloader
func (u *adminPermissionReader) getAdminPermissions(ctx context.Context, pIDs []uint) ([]*models.AdminPermission, []error) {
	var adminPermissions []*models.AdminPermission
	err := u.db.Where("id IN ?", pIDs).Find(&adminPermissions).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	adminPermissionMap := make(map[uint]*models.AdminPermission, len(adminPermissions))
	for _, adminPermission := range adminPermissions {
		adminPermissionMap[adminPermission.ID] = adminPermission
	}

	// Match order of input IDs
	result := make([]*models.AdminPermission, len(pIDs))
	errs := make([]error, len(pIDs))
	for i, id := range pIDs {
		if p, ok := adminPermissionMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("adminPermission not found: %d", id)
		}
	}

	return result, errs
}

func (er *adminPermissionReader) getAdminPermissionsByAdminPermissiopID(ctx context.Context, pIDs []uint) ([]*models.AdminPermission, []error) {
	var adminPermissions []*models.AdminPermission
	err := er.db.Where("adminPermission_id IN ?", pIDs).Find(&adminPermissions).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map adminPermission_id to adminPermission
	adminPermissionMap := make(map[uint]*models.AdminPermission, len(adminPermissions))
	for _, n := range adminPermissions {
		adminPermissionMap[n.ID] = n
	}

	results := make([]*models.AdminPermission, len(pIDs))
	errors := make([]error, len(pIDs))
	for i, uid := range pIDs {
		if p, ok := adminPermissionMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no adminPermission found for adminPermission_id: %d", uid)
		}
	}
	return results, errors
}

// GetAdminPermission returns single adminPermission by id efficiently
func GetAdminPermission(ctx context.Context, adminPermissiopID uint) (*models.AdminPermission, error) {
	loaders := For(ctx)
	return loaders.AdminPermissionLoader.Load(ctx, adminPermissiopID)
}

// GetTopAdminPermissions returns many adminPermissions by ids efficiently
func (er *adminPermissionReader) GetTopAdminPermissions(ctx context.Context) ([]*models.AdminPermission, error) {
	var adminPermissions []*models.AdminPermission

	db := er.db.Model(&models.AdminPermission{}).Joins("User").Preload("Domain", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid, name")
	})

	db.Where("show_from < ?", time.Now().Format(time.RFC3339))
	db.Where("show_to > ?", time.Now().Format(time.RFC3339))

	db.Limit(5).Offset(0)
	db = db.Order("created_at desc, updated_at desc,  order_num asc")

	// Query results

	if err := db.Find(&adminPermissions).Error; err != nil {
		return nil, err
	}
	return adminPermissions, nil
}

// GetAdminPermissions returns many adminPermissions by ids efficiently
func (er *adminPermissionReader) GetAdminPermissions(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.AdminPermissionList, error) {
	var adminPermissions []*models.AdminPermission

	db := er.db.Model(&models.AdminPermission{}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid, name, role, type")
	})
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

	if err := db.Find(&adminPermissions).Error; err != nil {
		return nil, err
	}
	return &model.AdminPermissionList{
		AdminPermissions: adminPermissions,
		Total:            int32(count),
	}, nil
}

// CreateAdminPermission updates a adminPermission by ID
func (er *adminPermissionReader) CreateAdminPermission(ctx context.Context, updates model.NewAdminPermission) (*models.AdminPermission, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	adminPermission := models.AdminPermission{
		UserID: updates.UserID,
	}

	if updates.Membership != nil {
		adminPermission.Membership = *updates.Membership
	}

	if updates.IP != nil {
		adminPermission.IP = *updates.IP
	}

	if updates.Sale != nil {
		adminPermission.Sale = *updates.Sale
	}

	if updates.Settlement != nil {
		adminPermission.Settlement = *updates.Settlement
	}
	if updates.Dwdelete != nil {
		adminPermission.Dwdelete = *updates.Dwdelete
	}
	if updates.Financials != nil {
		adminPermission.Financials = *updates.Financials
	}
	if updates.Game != nil {
		adminPermission.Game = *updates.Game
	}
	if updates.Qna != nil {
		adminPermission.Qna = *updates.Qna
	}
	if updates.Statistical != nil {
		adminPermission.Statistical = *updates.Statistical
	}
	if updates.Status != nil {
		adminPermission.Status = *updates.Status
	}
	if err := er.db.Save(&adminPermission).Error; err != nil {
		return nil, err
	}

	return &adminPermission, nil
}

// UpdateAdminPermission updates a adminPermission by ID
func (er *adminPermissionReader) UpdateAdminPermission(ctx context.Context, pID uint, updates model.UpdateAdminPermissionInput) (*models.AdminPermission, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	adminPermission := models.AdminPermission{}

	if err := initializers.DB.Model(&adminPermission).First(&adminPermission, pID).Error; err != nil {
		return nil, err
	}

	fmt.Println(updates)

	if updates.Membership != nil {
		adminPermission.Membership = *updates.Membership
	}

	if updates.IP != nil {
		adminPermission.IP = *updates.IP
	}

	if updates.Sale != nil {
		adminPermission.Sale = *updates.Sale
	}

	if updates.Settlement != nil {
		adminPermission.Settlement = *updates.Settlement
	}
	if updates.Dwdelete != nil {
		adminPermission.Dwdelete = *updates.Dwdelete
	}
	if updates.Financials != nil {
		adminPermission.Financials = *updates.Financials
	}

	if updates.Game != nil {
		adminPermission.Game = *updates.Game
	}
	if updates.Qna != nil {
		adminPermission.Qna = *updates.Qna
	}
	if updates.Statistical != nil {
		adminPermission.Statistical = *updates.Statistical
	}
	if updates.Status != nil {
		adminPermission.Status = *updates.Status
	}
	er.db.Save(adminPermission)

	return &adminPermission, nil
}

// DeleteAdminPermission deletes a adminPermission by ID (soft delete if GORM soft delete is enabled)
func (er *adminPermissionReader) DeleteAdminPermission(ctx context.Context, nid uint) error {
	n := &models.AdminPermission{}
	err := er.db.Model(&models.AdminPermission{}).First(&n, nid).Error
	if err != nil {
		return err
	}
	return er.db.Delete(&models.AdminPermission{}, nid).Error
}
