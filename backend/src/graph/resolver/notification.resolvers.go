package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.72

import (
	"context"
	"fmt"
	"time"

	"github.com/hotbrainy/go-betting/backend/graph/generated"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/loaders"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// CreateNotification is the resolver for the createNotification field.
func (r *mutationResolver) CreateNotification(ctx context.Context, input model.NewNotificationInput) (*models.Notification, error) {
	ldr := loaders.For(ctx)
	return ldr.NotificationReader.CreateNotification(ctx, input)
}

// UpdateNotification is the resolver for the updateNotification field.
func (r *mutationResolver) UpdateNotification(ctx context.Context, id uint, input model.UpdateNotificationInput) (*models.Notification, error) {
	ldr := loaders.For(ctx)
	return ldr.NotificationReader.UpdateNotification(ctx, id, input)
}

// DeleteNotification is the resolver for the deleteNotification field.
func (r *mutationResolver) DeleteNotification(ctx context.Context, id uint) (bool, error) {
	ldr := loaders.For(ctx)
	if err := ldr.NotificationReader.DeleteNotification(ctx, id); err != nil {
		return false, err
	}
	return true, nil
}

// ShowFrom is the resolver for the showFrom field.
func (r *notificationResolver) ShowFrom(ctx context.Context, obj *models.Notification) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: ShowFrom - showFrom"))
}

// ShowTo is the resolver for the showTo field.
func (r *notificationResolver) ShowTo(ctx context.Context, obj *models.Notification) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: ShowTo - showTo"))
}

// Notifications is the resolver for the notifications field.
func (r *queryResolver) Notifications(ctx context.Context) ([]*models.Notification, error) {
	panic(fmt.Errorf("not implemented: Notifications - notifications"))
}

// GetNotifications is the resolver for the getNotifications field.
func (r *queryResolver) GetNotifications(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.NotificationList, error) {
	ldr := loaders.For(ctx)
	return ldr.NotificationReader.GetNotifications(ctx, filters, orders, pagination)
}

// Notification returns generated.NotificationResolver implementation.
func (r *Resolver) Notification() generated.NotificationResolver { return &notificationResolver{r} }

type notificationResolver struct{ *Resolver }
