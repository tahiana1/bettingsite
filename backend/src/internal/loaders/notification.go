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

// notificationReader reads Notifications from a database
type notificationReader struct {
	db *gorm.DB
}

// getNotifications implements a batch function that can retrieve many notifications by ID,
// for use in a dataloader
func (u *notificationReader) getNotifications(ctx context.Context, nIDs []uint) ([]*models.Notification, []error) {
	var notifications []*models.Notification
	err := u.db.Where("id IN ?", nIDs).Find(&notifications).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	notificationMap := make(map[uint]*models.Notification, len(notifications))
	for _, notification := range notifications {
		notificationMap[notification.ID] = notification
	}

	// Match order of input IDs
	result := make([]*models.Notification, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := notificationMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("notification not found: %d", id)
		}
	}

	return result, errs
}

func (nr *notificationReader) getNotificationsByNotificationID(ctx context.Context, nIDs []uint) ([]*models.Notification, []error) {
	var notifications []*models.Notification
	err := nr.db.Where("notification_id IN ?", nIDs).Find(&notifications).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map notification_id to notification
	notificationMap := make(map[uint]*models.Notification, len(notifications))
	for _, n := range notifications {
		notificationMap[n.ID] = n
	}

	results := make([]*models.Notification, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := notificationMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no notification found for notification_id: %d", uid)
		}
	}
	return results, errors
}

// GetNotification returns single notification by id efficiently
func GetNotification(ctx context.Context, notificationID uint) (*models.Notification, error) {
	loaders := For(ctx)
	return loaders.NotificationLoader.Load(ctx, notificationID)
}

// GetNotifications returns many notifications by ids efficiently
func (nr *notificationReader) GetNotifications(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.NotificationList, error) {
	var notifications []*models.Notification

	db := nr.db.Model(&models.Notification{})
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

	if err := db.Find(&notifications).Error; err != nil {
		return nil, err
	}
	return &model.NotificationList{
		Notifications: notifications,
		Total:         int32(count),
	}, nil
}

// CreateNotification updates a notification by ID
func (nr *notificationReader) CreateNotification(ctx context.Context, updates model.NewNotificationInput) (*models.Notification, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	notification := models.Notification{
		Title:        updates.Title,
		Description:  updates.Description,
		MainImage:    updates.MainImage,
		ImageUpload:  updates.ImageUpload,
		NoticeType:   updates.NoticeType,
		RegisterDate: updates.RegisterDate,
		Views:        *updates.Views,
	}

	fmt.Println(updates)

	if err := nr.db.Save(&notification).Error; err != nil {
		return nil, err
	}

	return &notification, nil
}

// UpdateNotification updates a notification by ID
func (nr *notificationReader) UpdateNotification(ctx context.Context, nID uint, updates model.UpdateNotificationInput) (*models.Notification, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	notification := models.Notification{}

	if err := initializers.DB.Model(&notification).First(&notification, nID).Error; err != nil {
		return nil, err
	}

	if updates.Title != nil {
		notification.Title = *updates.Title
	}

	if updates.Description != nil {
		notification.Description = *updates.Description
	}

	if updates.Status != nil {
		notification.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		notification.OrderNum = *updates.OrderNum
	}

	if updates.MainImage != nil {
		notification.MainImage = *updates.MainImage
	}

	if updates.ImageUpload != nil {
		notification.ImageUpload = *updates.ImageUpload
	}

	if updates.NoticeType != nil {
		notification.NoticeType = *updates.NoticeType
	}

	if updates.RegisterDate != nil {
		notification.RegisterDate = *updates.RegisterDate
	}

	if updates.Views != nil {
		notification.Views = *updates.Views
	}

	nr.db.Save(notification)

	return &notification, nil
}

// DeleteNotification deletes a notification by ID (soft delete if GORM soft delete is enabled)
func (nr *notificationReader) DeleteNotification(ctx context.Context, nid uint) error {
	n := &models.Notification{}
	err := nr.db.Model(&models.Notification{}).First(&n, nid).Error
	if err != nil {
		return err
	}
	return nr.db.Delete(&models.Notification{}, nid).Error
}
