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

// inboxReader reads Inboxs from a database
type inboxReader struct {
	db *gorm.DB
}

// getInboxs implements a batch function that can retrieve many inboxs by ID,
// for use in a dataloader
func (u *inboxReader) getInboxes(ctx context.Context, nIDs []uint) ([]*models.Inbox, []error) {
	var inboxs []*models.Inbox
	err := u.db.Where("id IN ?", nIDs).Find(&inboxs).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	inboxMap := make(map[uint]*models.Inbox, len(inboxs))
	for _, inbox := range inboxs {
		inboxMap[inbox.ID] = inbox
	}

	// Match order of input IDs
	result := make([]*models.Inbox, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := inboxMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("inbox not found: %d", id)
		}
	}

	return result, errs
}

func (er *inboxReader) getInboxsByInboxID(ctx context.Context, nIDs []uint) ([]*models.Inbox, []error) {
	var inboxs []*models.Inbox
	err := er.db.Where("inbox_id IN ?", nIDs).Find(&inboxs).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map inbox_id to inbox
	inboxMap := make(map[uint]*models.Inbox, len(inboxs))
	for _, n := range inboxs {
		inboxMap[n.ID] = n
	}

	results := make([]*models.Inbox, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := inboxMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no inbox found for inbox_id: %d", uid)
		}
	}
	return results, errors
}

// GetInbox returns single inbox by id efficiently
func GetInbox(ctx context.Context, inboxID uint) (*models.Inbox, error) {
	loaders := For(ctx)
	return loaders.InboxLoader.Load(ctx, inboxID)
}

// GetInboxs returns many inboxs by ids efficiently
func (er *inboxReader) GetInboxs(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.InboxList, error) {
	var inboxes []*models.Inbox

	db := er.db.Model(&models.Inbox{}).Joins("User").Preload("User", func(db *gorm.DB) *gorm.DB {
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

	if err := db.Find(&inboxes).Error; err != nil {
		return nil, err
	}
	return &model.InboxList{
		Inboxes: inboxes,
		Total:   int32(count),
	}, nil
}

// CreateInbox updates a inbox by ID
func (er *inboxReader) CreateInbox(ctx context.Context, updates model.NewInboxInput) (*models.Inbox, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()
	authUser, err := helpers.GetAuthUser(ctx)

	if err != nil {
		return nil, err
	}

	inbox := models.Inbox{
		Title:       updates.Title,
		Description: updates.Description,
		UserID:      updates.UserID,
		FromID:      authUser.ID,
		Status:      true,
	}

	// if updates.OpenedAt != nil {
	// 	inbox.OpenedAt = *updates.OpenedAt
	// }

	if updates.Status != nil {
		inbox.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		inbox.OrderNum = *updates.OrderNum
	}

	if err := er.db.Save(&inbox).Error; err != nil {
		return nil, err
	}

	return &inbox, nil
}

// UpdateInbox updates a inbox by ID
func (er *inboxReader) UpdateInbox(ctx context.Context, nID uint, updates model.UpdateInboxInput) (*models.Inbox, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	inbox := models.Inbox{}

	if err := initializers.DB.Model(&inbox).First(&inbox, nID).Error; err != nil {
		return nil, err
	}

	fmt.Println(updates)

	if updates.Title != nil {
		inbox.Title = *updates.Title
	}

	if updates.Description != nil {
		inbox.Description = *updates.Description
	}

	if updates.Status != nil {
		inbox.Status = *updates.Status
	}

	// if updates.OpenedAt != nil {
	// 	inbox.OpenedAt = *updates.OpenedAt
	// }

	if updates.UserID != nil {
		inbox.UserID = *updates.UserID
	}

	if updates.OrderNum != nil {
		inbox.OrderNum = *updates.OrderNum
	}
	er.db.Save(inbox)

	return &inbox, nil
}

// DeleteInbox deletes a inbox by ID (soft delete if GORM soft delete is enabled)
func (er *inboxReader) DeleteInbox(ctx context.Context, nid uint) error {
	n := &models.Inbox{}
	err := er.db.Model(&models.Inbox{}).First(&n, nid).Error
	if err != nil {
		return err
	}
	return er.db.Delete(&models.Inbox{}, nid).Error
}
