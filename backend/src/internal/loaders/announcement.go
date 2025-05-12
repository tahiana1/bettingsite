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

// announcementReader reads Announcements from a database
type announcementReader struct {
	db *gorm.DB
}

// getAnnouncements implements a batch function that can retrieve many announcements by ID,
// for use in a dataloader
func (u *announcementReader) getAnnouncements(ctx context.Context, nIDs []uint) ([]*models.Announcement, []error) {
	var announcements []*models.Announcement
	err := u.db.Where("id IN ?", nIDs).Find(&announcements).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	announcementMap := make(map[uint]*models.Announcement, len(announcements))
	for _, announcement := range announcements {
		announcementMap[announcement.ID] = announcement
	}

	// Match order of input IDs
	result := make([]*models.Announcement, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := announcementMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("announcement not found: %d", id)
		}
	}

	return result, errs
}

func (er *announcementReader) getAnnouncementsByAnnouncementID(ctx context.Context, nIDs []uint) ([]*models.Announcement, []error) {
	var announcements []*models.Announcement
	err := er.db.Where("announcement_id IN ?", nIDs).Find(&announcements).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map announcement_id to announcement
	announcementMap := make(map[uint]*models.Announcement, len(announcements))
	for _, n := range announcements {
		announcementMap[n.ID] = n
	}

	results := make([]*models.Announcement, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := announcementMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no announcement found for announcement_id: %d", uid)
		}
	}
	return results, errors
}

// GetAnnouncement returns single announcement by id efficiently
func GetAnnouncement(ctx context.Context, announcementID uint) (*models.Announcement, error) {
	loaders := For(ctx)
	return loaders.AnnouncementLoader.Load(ctx, announcementID)
}

// GetAnnouncements returns many announcements by ids efficiently
func (er *announcementReader) GetLatestAnnouncements(ctx context.Context) ([]*models.Announcement, error) {
	var announcements []*models.Announcement

	db := er.db.Model(&models.Announcement{}).Joins("User").Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid, name")
	})

	db.Where("show_from < ? AND show_to > ?", time.Now().Format(time.RFC3339), time.Now().Format(time.RFC3339))

	db = db.Limit(5).Offset(0)
	db = db.Order("updated_at desc, created_at desc, order_num desc")

	// Query results

	if err := db.Find(&announcements).Error; err != nil {
		return nil, err
	}
	return announcements, nil
}

// GetAnnouncements returns many announcements by ids efficiently
func (er *announcementReader) GetAnnouncements(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.AnnouncementList, error) {
	var announcements []*models.Announcement

	db := er.db.Model(&models.Announcement{}).Joins("User").Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid, name")
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

	db = db.Order("order_num asc")

	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&announcements).Error; err != nil {
		return nil, err
	}
	return &model.AnnouncementList{
		Announcements: announcements,
		Total:         int32(count),
	}, nil
}

// CreateAnnouncement updates a announcement by ID
func (er *announcementReader) CreateAnnouncement(ctx context.Context, updates model.NewAnnouncementInput) (*models.Announcement, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()
	authUser, err := helpers.GetAuthUser(ctx)

	if err != nil {
		return nil, err
	}

	announcement := models.Announcement{
		Title:       updates.Title,
		Description: updates.Description,
		UserID:      authUser.ID,
		Status:      true,
	}

	if updates.ShowFrom != nil {
		announcement.ShowFrom = *updates.ShowFrom
	}

	if updates.ShowTo != nil {
		announcement.ShowTo = *updates.ShowTo
	}

	if updates.Status != nil {
		announcement.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		announcement.OrderNum = *updates.OrderNum
	}

	if err := er.db.Save(&announcement).Error; err != nil {
		return nil, err
	}

	return &announcement, nil
}

// UpdateAnnouncement updates a announcement by ID
func (er *announcementReader) UpdateAnnouncement(ctx context.Context, nID uint, updates model.UpdateAnnouncementInput) (*models.Announcement, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	announcement := models.Announcement{}

	if err := initializers.DB.Model(&announcement).First(&announcement, nID).Error; err != nil {
		return nil, err
	}

	fmt.Println(updates)

	if updates.Title != nil {
		announcement.Title = *updates.Title
	}

	if updates.Description != nil {
		announcement.Description = *updates.Description
	}

	if updates.Status != nil {
		announcement.Status = *updates.Status
	}

	if updates.ShowFrom != nil {
		announcement.ShowFrom = *updates.ShowFrom
	}

	if updates.ShowTo != nil {
		announcement.ShowTo = *updates.ShowTo
	}

	if updates.OrderNum != nil {
		announcement.OrderNum = *updates.OrderNum
	}
	er.db.Save(announcement)

	return &announcement, nil
}

// DeleteAnnouncement deletes a announcement by ID (soft delete if GORM soft delete is enabled)
func (er *announcementReader) DeleteAnnouncement(ctx context.Context, aid uint) (bool, error) {
	n := &models.Announcement{}
	err := er.db.Model(&models.Announcement{}).First(&n, aid).Error
	if err != nil {
		return false, err
	}
	if err := er.db.Delete(&models.Announcement{}, aid).Error; err != nil {
		return false, err
	}
	return true, nil
}
