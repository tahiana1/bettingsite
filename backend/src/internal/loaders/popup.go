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

// popupReader reads Popups from a database
type popupReader struct {
	db *gorm.DB
}

// getPopups implements a batch function that can retrieve many popups by ID,
// for use in a dataloader
func (u *popupReader) getPopups(ctx context.Context, pIDs []uint) ([]*models.Popup, []error) {
	var popups []*models.Popup
	err := u.db.Where("id IN ?", pIDs).Find(&popups).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	popupMap := make(map[uint]*models.Popup, len(popups))
	for _, popup := range popups {
		popupMap[popup.ID] = popup
	}

	// Match order of input IDs
	result := make([]*models.Popup, len(pIDs))
	errs := make([]error, len(pIDs))
	for i, id := range pIDs {
		if p, ok := popupMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("popup not found: %d", id)
		}
	}

	return result, errs
}

func (pr *popupReader) getPopupsByPopupID(ctx context.Context, pIDs []uint) ([]*models.Popup, []error) {
	var popups []*models.Popup
	err := pr.db.Where("popup_id IN ?", pIDs).Find(&popups).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map popup_id to popup
	popupMap := make(map[uint]*models.Popup, len(popups))
	for _, p := range popups {
		popupMap[p.ID] = p
	}

	results := make([]*models.Popup, len(pIDs))
	errors := make([]error, len(pIDs))
	for i, uid := range pIDs {
		if p, ok := popupMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no popup found for popup_id: %d", uid)
		}
	}
	return results, errors
}

// GetPopup returns single popup by id efficiently
func GetPopup(ctx context.Context, popupID uint) (*models.Popup, error) {
	loaders := For(ctx)
	return loaders.PopupLoader.Load(ctx, popupID)
}

// GetPopups returns many popups by ids efficiently
func (pr *popupReader) GetPopups(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.PopupList, error) {
	var popups []*models.Popup

	db := pr.db.Model(&models.Popup{})
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

	if err := db.Find(&popups).Error; err != nil {
		return nil, err
	}
	return &model.PopupList{
		Popups: popups,
		Total:  int32(count),
	}, nil
}

// CreatePopup creates a new popup
func (pr *popupReader) CreatePopup(ctx context.Context, updates model.NewPopupInput) (*models.Popup, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	popup := models.Popup{
		Title:        updates.Title,
		Description:  updates.Description,
		Status:       updates.Status != nil && *updates.Status,
		OrderNum:     *updates.OrderNum,
		RegisterDate: time.Now(), // Set to current time if not provided
		ShowFrom:     *updates.ShowFrom,
		ShowTo:       *updates.ShowTo,
	}

	// Set new fields with defaults if not provided
	if updates.DisplayType != nil {
		popup.DisplayType = *updates.DisplayType
	} else {
		popup.DisplayType = "standard"
	}

	if updates.ShowOn != nil {
		popup.ShowOn = *updates.ShowOn
	} else {
		popup.ShowOn = "both"
	}

	if updates.Width != nil {
		popup.Width = *updates.Width
	}

	if updates.Height != nil {
		popup.Height = *updates.Height
	}

	// Override registerDate if provided
	if updates.RegisterDate != nil {
		popup.RegisterDate = *updates.RegisterDate
	}

	fmt.Println(updates)

	if err := pr.db.Save(&popup).Error; err != nil {
		return nil, err
	}

	return &popup, nil
}

// UpdatePopup updates a popup by ID
func (pr *popupReader) UpdatePopup(ctx context.Context, pID uint, updates model.UpdatePopupInput) (*models.Popup, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	popup := models.Popup{}

	if err := initializers.DB.Model(&popup).First(&popup, pID).Error; err != nil {
		return nil, err
	}

	if updates.Title != nil {
		popup.Title = *updates.Title
	}

	if updates.Description != nil {
		popup.Description = *updates.Description
	}

	if updates.Status != nil {
		popup.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		popup.OrderNum = *updates.OrderNum
	}

	if updates.RegisterDate != nil {
		popup.RegisterDate = *updates.RegisterDate
	}

	if updates.ShowFrom != nil {
		popup.ShowFrom = *updates.ShowFrom
	}

	if updates.ShowTo != nil {
		popup.ShowTo = *updates.ShowTo
	}

	if updates.DisplayType != nil {
		popup.DisplayType = *updates.DisplayType
	}

	if updates.ShowOn != nil {
		popup.ShowOn = *updates.ShowOn
	}

	if updates.Width != nil {
		popup.Width = *updates.Width
	}

	if updates.Height != nil {
		popup.Height = *updates.Height
	}

	pr.db.Save(popup)

	return &popup, nil
}

// DeletePopup deletes a popup by ID (soft delete if GORM soft delete is enabled)
func (pr *popupReader) DeletePopup(ctx context.Context, pID uint) error {
	return pr.db.Delete(&models.Popup{}, pID).Error
}
