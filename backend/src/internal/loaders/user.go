package loaders

import (
	"context"
	"fmt"

	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// userReader loads users from the DB
type userReader struct {
	db *gorm.DB
}

func (ur *userReader) getUsers(ctx context.Context, userIDs []uint) ([]*models.User, []error) {
	var users []*models.User
	err := ur.db.Where("id IN ?", userIDs).Find(&users).Error
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
