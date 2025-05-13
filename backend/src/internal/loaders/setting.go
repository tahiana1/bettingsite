package loaders

// import vikstrous/dataloadgen with your other imports
import (
	"context"
	"fmt"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// settingReader reads Settings from a database
type settingReader struct {
	db *gorm.DB
}

// getSettings implements a batch function that can retrieve many settings by ID,
// for use in a dataloader
func (u *settingReader) getSettings(ctx context.Context, nIDs []uint) ([]*models.Setting, []error) {
	var settings []*models.Setting
	err := u.db.Where("id IN ?", nIDs).Find(&settings).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	settingMap := make(map[uint]*models.Setting, len(settings))
	for _, setting := range settings {
		settingMap[setting.ID] = setting
	}

	// Match order of input IDs
	result := make([]*models.Setting, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := settingMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("setting not found: %d", id)
		}
	}

	return result, errs
}

// GetSetting returns single setting by id efficiently
func (er *settingReader) GetSetting(ctx context.Context) (*models.Setting, error) {
	n := &models.Setting{}
	err := er.db.Model(&models.Setting{}).First(&n).Error
	if err != nil {
		return nil, err
	}
	return n, nil
}

// CreateSetting updates a setting by ID
func (er *settingReader) CreateSetting(ctx context.Context, updates model.NewSettingInput) (*models.Setting, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	setting := models.Setting{
		Title:       *updates.Title,
		Description: *updates.Description,
		UserID:      *updates.UserID,
	}

	if updates.Title != nil {
		setting.Title = *updates.Title
	}

	if updates.Description != nil {
		setting.Description = *updates.Description
	}

	if updates.UserID != nil {
		setting.UserID = *updates.UserID
	}
	if updates.PrimaryDomain != nil {
		setting.PrimaryDomain = *updates.PrimaryDomain
	}

	if updates.TotalExStatus != nil {
		setting.TotalExStatus = *updates.TotalExStatus
	}

	if updates.TotalExFrom != nil {
		setting.TotalExFrom = *updates.TotalExFrom
	}

	if updates.TotalExTo != nil {
		setting.TotalExTo = *updates.TotalExTo
	}

	if updates.UserExStatus != nil {
		setting.UserExStatus = *updates.UserExStatus
	}

	if updates.UserExFrom != nil {
		setting.UserExFrom = *updates.UserExFrom
	}

	if updates.UserExTo != nil {
		setting.UserExTo = *updates.UserExTo
	}

	if updates.Status != nil {
		setting.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		setting.OrderNum = *updates.OrderNum
	}

	if err := er.db.Save(&setting).Error; err != nil {
		return nil, err
	}

	return &setting, nil
}

// UpdateSetting updates a setting by ID
func (er *settingReader) UpdateSetting(ctx context.Context, nID uint, updates model.UpdateSettingInput) (*models.Setting, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	setting := models.Setting{}

	if err := initializers.DB.Model(&setting).First(&setting, nID).Error; err != nil {
		return nil, err
	}

	if updates.Title != nil {
		setting.Title = *updates.Title
	}

	if updates.Description != nil {
		setting.Description = *updates.Description
	}

	if updates.Title != nil {
		setting.Title = *updates.Title
	}

	if updates.Description != nil {
		setting.Description = *updates.Description
	}

	if updates.UserID != nil {
		setting.UserID = *updates.UserID
	}
	if updates.PrimaryDomain != nil {
		setting.PrimaryDomain = *updates.PrimaryDomain
	}

	if updates.TotalExStatus != nil {
		setting.TotalExStatus = *updates.TotalExStatus
	}

	if updates.TotalExFrom != nil {
		setting.TotalExFrom = *updates.TotalExFrom
	}

	if updates.TotalExTo != nil {
		setting.TotalExTo = *updates.TotalExTo
	}

	if updates.UserExStatus != nil {
		setting.UserExStatus = *updates.UserExStatus
	}

	if updates.UserExFrom != nil {
		setting.UserExFrom = *updates.UserExFrom
	}

	if updates.UserExTo != nil {
		setting.UserExTo = *updates.UserExTo
	}

	if updates.Status != nil {
		setting.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		setting.OrderNum = *updates.OrderNum
	}
	er.db.Save(setting)

	return &setting, nil
}

// DeleteSetting deletes a setting by ID (soft delete if GORM soft delete is enabled)
func (er *settingReader) DeleteSetting(ctx context.Context, nid uint) error {
	n := &models.Setting{}
	err := er.db.Model(&models.Setting{}).First(&n, nid).Error
	if err != nil {
		return err
	}
	return er.db.Delete(&models.Setting{}, nid).Error
}
