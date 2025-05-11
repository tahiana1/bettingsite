package loaders

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

// userReader loads users from the DB
type userReader struct {
	db *gorm.DB
}

func (ur *userReader) getUsers(ctx context.Context, userIDs []uint) ([]*models.User, []error) {
	var users []*models.User
	err := ur.db.Where("id IN ?", userIDs).Order("order_num").Find(&users).Error
	if err != nil {
		return nil, []error{err}
	}

	userMap := make(map[uint]*models.User, len(users))
	for _, user := range users {
		userMap[user.ID] = user
	}

	results := make([]*models.User, len(userIDs))
	errs := make([]error, len(userIDs))
	for i, id := range userIDs {
		if u, ok := userMap[id]; ok {
			results[i] = u
			errs[i] = nil
		} else {
			results[i] = nil
			errs[i] = fmt.Errorf("user not found: %d", id)
		}
	}
	return results, errs
}

// GetProfiles returns many profiles by ids efficiently
func (ur *userReader) GetUsers(ctx context.Context) ([]*models.User, error) {
	// loaders := For(ctx)
	// return loaders.UserLoader.LoadAll(ctx, userIDs)

	var users []*models.User
	err := initializers.DB.Model(&models.User{}).Preload("Profile").Limit(10).Offset(0).Order("order_num").Find(&users).Error

	return users, err
}

// GetProfiles returns many profiles by ids efficiently
func GetUser(ctx context.Context, userID uint) (*models.User, error) {
	loaders := For(ctx)
	return loaders.UserLoader.Load(ctx, userID)
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *userReader) ApproveUser(ctx context.Context, userID uint) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()
	fmt.Println(userID)

	me := models.User{}

	if err := initializers.DB.Model(&me).First(&me, "id = ?", userID).Error; err != nil {
		return err
	}
	me.Status = "A"

	tx := initializers.DB.Save(&me)

	return tx.Error
	// return pr.db.Delete(&models.Profile{}, profileID).Error
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *userReader) BlockUser(ctx context.Context, userID uint) error {
	fmt.Println(userID)
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()
	fmt.Println(userID)

	me := models.User{}

	if err := initializers.DB.Model(&me).First(&me, "id = ?", userID).Error; err != nil {
		return err
	}
	me.Status = "B"

	tx := initializers.DB.Save(&me)

	return tx.Error
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *userReader) DeleteUser(ctx context.Context, userID uint) error {
	fmt.Println(userID)
	return nil
	// return pr.db.Delete(&models.Profile{}, profileID).Error
}

// GetProfiles returns many profiles by ids efficiently
func (ur *userReader) FilterUsers(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.UserList, error) {
	// loaders := For(ctx)
	// return loaders.UserLoader.LoadAll(ctx, userIDs)
	var users []*models.User

	db := ur.db.Model(&models.User{}).Joins("Profile")
	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	db = db.Order("order_num")
	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&users).Error; err != nil {
		return nil, err
	}

	return &model.UserList{
		Users: users,
		Total: int32(count),
	}, nil
}

// GetProfiles returns many profiles by ids efficiently
func (ur *userReader) ConnectedUsers(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.UserList, error) {
	// loaders := For(ctx)
	// return loaders.UserLoader.LoadAll(ctx, userIDs)
	var users []*models.User

	db := ur.db.Model(&models.User{}).Joins("Profile")
	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	db = db.Order("order_num")
	// Pagination

	db = helpers.ApplyPagination(db, pagination)
	fmt.Println(time.Now().Local().Add(time.Minute * -5).Format(time.RFC3339))
	fmt.Println(time.Now().Local().Format(time.RFC3339))
	// Current status is approved
	db = db.Where("users.updated_at > ? AND status = 'A'", time.Now().Local().Add(time.Minute*-5).Format(time.RFC3339))

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}
	// Query results

	if err := db.Find(&users).Error; err != nil {
		return nil, err
	}

	return &model.UserList{
		Users: users,
		Total: int32(count),
	}, nil
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *userReader) UpdateUser(ctx context.Context, userID uint, updates model.UpdateUser) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	me := models.User{}

	if err := initializers.DB.Model(&me).First(&me, "id = ?", userID).Error; err != nil {
		return err
	}

	if updates.Name != nil {
		me.Name = *updates.Name
	}
	if updates.OrderNum != nil {
		me.OrderNum = *updates.OrderNum
	}
	if updates.Role != nil {
		me.Role = *updates.Role
	}
	if updates.Type != nil {
		me.Type = string(*updates.Type)
	}
	if updates.UsdtAddress != nil {
		me.USDTAddress = *updates.UsdtAddress
	}
	if updates.Status != nil {
		me.Status = string(*updates.Status)
	}

	tx := initializers.DB.Save(&me)

	return tx.Error
}
