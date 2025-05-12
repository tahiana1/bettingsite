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

// eventReader reads Events from a database
type eventReader struct {
	db *gorm.DB
}

// getEvents implements a batch function that can retrieve many events by ID,
// for use in a dataloader
func (u *eventReader) getEvents(ctx context.Context, nIDs []uint) ([]*models.Event, []error) {
	var events []*models.Event
	err := u.db.Where("id IN ?", nIDs).Find(&events).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	eventMap := make(map[uint]*models.Event, len(events))
	for _, event := range events {
		eventMap[event.ID] = event
	}

	// Match order of input IDs
	result := make([]*models.Event, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := eventMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("event not found: %d", id)
		}
	}

	return result, errs
}

func (er *eventReader) getEventsByEventID(ctx context.Context, nIDs []uint) ([]*models.Event, []error) {
	var events []*models.Event
	err := er.db.Where("event_id IN ?", nIDs).Find(&events).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map event_id to event
	eventMap := make(map[uint]*models.Event, len(events))
	for _, n := range events {
		eventMap[n.ID] = n
	}

	results := make([]*models.Event, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := eventMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no event found for event_id: %d", uid)
		}
	}
	return results, errors
}

// GetEvent returns single event by id efficiently
func GetEvent(ctx context.Context, eventID uint) (*models.Event, error) {
	loaders := For(ctx)
	return loaders.EventLoader.Load(ctx, eventID)
}

// GetTopEvents returns many events by ids efficiently
func (er *eventReader) GetTopEvents(ctx context.Context) ([]*models.Event, error) {
	var events []*models.Event

	db := er.db.Model(&models.Event{}).Joins("User").Preload("Domain", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid, name")
	})

	db.Where("show_from < ?", time.Now().Format(time.RFC3339))
	db.Where("show_to > ?", time.Now().Format(time.RFC3339))

	db.Limit(5).Offset(0)
	db = db.Order("created_at desc, updated_at desc,  order_num asc")

	// Query results

	if err := db.Find(&events).Error; err != nil {
		return nil, err
	}
	return events, nil
}

// GetEvents returns many events by ids efficiently
func (er *eventReader) GetEvents(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.EventList, error) {
	var events []*models.Event

	db := er.db.Model(&models.Event{}).Joins("User").Preload("Domain", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).Preload("User", func(db *gorm.DB) *gorm.DB {
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

	if err := db.Find(&events).Error; err != nil {
		return nil, err
	}
	return &model.EventList{
		Events: events,
		Total:  int32(count),
	}, nil
}

// CreateEvent updates a event by ID
func (er *eventReader) CreateEvent(ctx context.Context, updates model.NewEventInput) (*models.Event, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()
	authUser, err := helpers.GetAuthUser(ctx)

	if err != nil {
		return nil, err
	}

	event := models.Event{
		Title:       updates.Title,
		Description: updates.Description,
		UserID:      authUser.ID,
		Type:        updates.Type,
		Status:      true,
	}

	if updates.DomainID != nil {
		event.DomainID = updates.DomainID
	}

	if updates.Type != "" {
		event.Type = updates.Type
	}

	if updates.ShowFrom != nil {
		event.ShowFrom = *updates.ShowFrom
	}

	if updates.ShowTo != nil {
		event.ShowTo = *updates.ShowTo
	}

	if updates.Level != nil {
		event.Level = *updates.Level
	}

	if updates.Status != nil {
		event.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		event.OrderNum = *updates.OrderNum
	}

	if err := er.db.Save(&event).Error; err != nil {
		return nil, err
	}

	return &event, nil
}

// UpdateEvent updates a event by ID
func (er *eventReader) UpdateEvent(ctx context.Context, nID uint, updates model.UpdateEventInput) (*models.Event, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	event := models.Event{}

	if err := initializers.DB.Model(&event).First(&event, nID).Error; err != nil {
		return nil, err
	}

	fmt.Println(updates)

	if updates.Title != nil {
		event.Title = *updates.Title
	}

	if updates.Description != nil {
		event.Description = *updates.Description
	}

	if updates.Status != nil {
		event.Status = *updates.Status
	}

	if updates.DomainID != nil {
		event.DomainID = updates.DomainID
	}

	if updates.Level != nil {
		event.Level = *updates.Level
	}

	if updates.ShowFrom != nil {
		event.ShowFrom = *updates.ShowFrom
	}

	if updates.ShowTo != nil {
		event.ShowTo = *updates.ShowTo
	}

	if updates.OrderNum != nil {
		event.OrderNum = *updates.OrderNum
	}
	er.db.Save(event)

	return &event, nil
}

// DeleteEvent deletes a event by ID (soft delete if GORM soft delete is enabled)
func (er *eventReader) DeleteEvent(ctx context.Context, nid uint) error {
	n := &models.Event{}
	err := er.db.Model(&models.Event{}).First(&n, nid).Error
	if err != nil {
		return err
	}
	return er.db.Delete(&models.Event{}, nid).Error
}
