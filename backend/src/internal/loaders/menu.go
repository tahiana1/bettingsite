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

// menuReader reads Menus from a database
type menuReader struct {
	db *gorm.DB
}

// getMenus implements a batch function that can retrieve many menus by ID,
// for use in a dataloader
func (u *menuReader) getMenus(ctx context.Context, nIDs []uint) ([]*models.Menu, []error) {
	var menus []*models.Menu
	err := u.db.Where("id IN ?", nIDs).Find(&menus).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	menuMap := make(map[uint]*models.Menu, len(menus))
	for _, menu := range menus {
		menuMap[menu.ID] = menu
	}

	// Match order of input IDs
	result := make([]*models.Menu, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := menuMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("menu not found: %d", id)
		}
	}

	return result, errs
}

func (er *menuReader) getMenusByMenuID(ctx context.Context, nIDs []uint) ([]*models.Menu, []error) {
	var menus []*models.Menu
	err := er.db.Where("menu_id IN ?", nIDs).Find(&menus).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map menu_id to menu
	menuMap := make(map[uint]*models.Menu, len(menus))
	for _, n := range menus {
		menuMap[n.ID] = n
	}

	results := make([]*models.Menu, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := menuMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no menu found for menu_id: %d", uid)
		}
	}
	return results, errors
}

// GetMenu returns single menu by id efficiently
func GetMenu(ctx context.Context, menuID uint) (*models.Menu, error) {
	loaders := For(ctx)
	return loaders.MenuLoader.Load(ctx, menuID)
}

// GetMenus returns many menus by ids efficiently
func (er *menuReader) GetUserMenus(ctx context.Context) ([]*models.Menu, error) {
	var menus []*models.Menu

	db := er.db.Model(&models.Menu{}).Preload("Children")
	db = db.Where("status = ?", true)
	// Ordering

	db = db.Order("order_num asc")

	// Query results

	if err := db.Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}

// GetMenus returns many menus by ids efficiently
func (er *menuReader) GetMenus(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.MenuList, error) {
	var menus []*models.Menu

	db := er.db.Model(&models.Menu{}).Preload("Children")

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

	if err := db.Find(&menus).Error; err != nil {
		return nil, err
	}
	return &model.MenuList{
		Menus: menus,
		Total: int32(count),
	}, nil
}

// CreateMenu updates a menu by ID
func (er *menuReader) CreateMenu(ctx context.Context, updates model.NewMenuInput) (*models.Menu, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	// authUser, err := helpers.GetAuthUser(ctx)

	// if err != nil {
	// 	return nil, err
	// }

	menu := models.Menu{
		Label:    updates.Label,
		ParentID: updates.ParentID,
		OrderNum: *updates.OrderNum,
		Status:   true,
	}

	// if updates.OpenedAt != nil {
	// 	menu.OpenedAt = *updates.OpenedAt
	// }

	if updates.Description != nil {
		menu.Description = *updates.Description
	}

	if updates.Status != nil {
		menu.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		menu.OrderNum = *updates.OrderNum
	}

	if err := er.db.Save(&menu).Error; err != nil {
		return nil, err
	}

	return &menu, nil
}

// UpdateMenu updates a menu by ID
func (er *menuReader) UpdateMenu(ctx context.Context, nID uint, updates model.UpdateMenuInput) (*models.Menu, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	menu := models.Menu{}

	if err := initializers.DB.Model(&menu).First(&menu, nID).Error; err != nil {
		return nil, err
	}

	fmt.Println(updates)

	if updates.Label != nil {
		menu.Label = *updates.Label
	}

	if updates.Description != nil {
		menu.Description = *updates.Description
	}

	if updates.Status != nil {
		menu.Status = *updates.Status
	}

	// if updates.OpenedAt != nil {
	// 	menu.OpenedAt = *updates.OpenedAt
	// }

	if updates.ParentID != nil {
		menu.ParentID = updates.ParentID
	}

	if updates.OrderNum != nil {
		menu.OrderNum = *updates.OrderNum
	}
	er.db.Save(menu)

	return &menu, nil
}

// DeleteMenu deletes a menu by ID (soft delete if GORM soft delete is enabled)
func (er *menuReader) DeleteMenu(ctx context.Context, nid uint) error {
	n := &models.Menu{}
	err := er.db.Model(&models.Menu{}).First(&n, nid).Error
	if err != nil {
		return err
	}
	return er.db.Delete(&models.Menu{}, nid).Error
}
