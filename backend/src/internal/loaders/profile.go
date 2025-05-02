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

type ctxKey string

// profileReader reads Profiles from a database
type profileReader struct {
	db *gorm.DB
}

// getProfiles implements a batch function that can retrieve many profiles by ID,
// for use in a dataloader
func (u *profileReader) getProfiles(ctx context.Context, profileIDs []uint) ([]*models.Profile, []error) {
	fmt.Println("============profileIDs")
	fmt.Println(profileIDs)
	var profiles []*models.Profile
	err := u.db.Where("id IN ?", profileIDs).Find(&profiles).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	profileMap := make(map[uint]*models.Profile, len(profiles))
	for _, profile := range profiles {
		profileMap[profile.ID] = profile
	}

	// Match order of input IDs
	result := make([]*models.Profile, len(profileIDs))
	errs := make([]error, len(profileIDs))
	for i, id := range profileIDs {
		if p, ok := profileMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("profile not found: %d", id)
		}
	}

	return result, errs
}

func (pr *profileReader) getProfilesByUserID(ctx context.Context, userIDs []uint) ([]*models.Profile, []error) {
	var profiles []*models.Profile
	err := pr.db.Where("user_id IN ?", userIDs).Find(&profiles).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map user_id to profile
	profileMap := make(map[uint]*models.Profile, len(profiles))
	for _, p := range profiles {
		profileMap[p.UserID] = p
	}

	results := make([]*models.Profile, len(userIDs))
	errors := make([]error, len(userIDs))
	for i, uid := range userIDs {
		if p, ok := profileMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no profile found for user_id: %d", uid)
		}
	}
	return results, errors
}

// GetProfile returns single profile by id efficiently
func GetProfile(ctx context.Context, profileID uint) (*models.Profile, error) {
	loaders := For(ctx)
	return loaders.ProfileLoader.Load(ctx, profileID)
}

// GetProfiles returns many profiles by ids efficiently
func GetProfiles(ctx context.Context, profileIDs []uint) ([]*models.Profile, error) {
	loaders := For(ctx)
	return loaders.ProfileLoader.LoadAll(ctx, profileIDs)
}

func GetProfileByUserID(ctx context.Context, userID uint) (*models.Profile, error) {
	loaders := For(ctx)
	return loaders.ProfileByUserIDLoader.Load(ctx, userID)
}

// UpdateProfile updates a profile by ID
func (pr *profileReader) UpdateProfile(ctx context.Context, userID uint, updates model.UpdateProfile) (*models.Profile, error) {
	profile := models.Profile{}
	fmt.Println("======updates======")
	fmt.Println(updates)
	fmt.Println("======updates======")
	if err := initializers.DB.Model(&profile).First(&profile, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}

	// // Apply updates
	// if err := pr.db.Model(&profile).Updates(updates).Error; err != nil {
	// 	return nil, err
	// }

	// // Optional: Reload the profile to get latest data
	// if err := pr.db.First(&profile, profileID).Error; err != nil {
	// 	return nil, err
	// }

	return &profile, nil
}

// DeleteProfile deletes a profile by ID (soft delete if GORM soft delete is enabled)
func (pr *profileReader) DeleteProfile(ctx context.Context, profileID uint) error {
	fmt.Println(profileID)
	return nil
	// return pr.db.Delete(&models.Profile{}, profileID).Error
}
