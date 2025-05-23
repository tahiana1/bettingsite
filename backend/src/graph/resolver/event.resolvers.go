package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.72

import (
	"context"

	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/loaders"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// CreateEvent is the resolver for the createEvent field.
func (r *mutationResolver) CreateEvent(ctx context.Context, input model.NewEventInput) (*models.Event, error) {
	ldr := loaders.For(ctx)

	return ldr.EventReader.CreateEvent(ctx, input)
}

// UpdateEvent is the resolver for the updateEvent field.
func (r *mutationResolver) UpdateEvent(ctx context.Context, id uint, input model.UpdateEventInput) (*models.Event, error) {
	ldr := loaders.For(ctx)

	return ldr.EventReader.UpdateEvent(ctx, id, input)
}

// DeleteEvent is the resolver for the deleteEvent field.
func (r *mutationResolver) DeleteEvent(ctx context.Context, id uint) (bool, error) {
	return true, nil
}

// TopEvents is the resolver for the topEvents field.
func (r *queryResolver) TopEvents(ctx context.Context) ([]*models.Event, error) {
	ldr := loaders.For(ctx)
	return ldr.EventReader.GetTopEvents(ctx)
}

// Events is the resolver for the events field.
func (r *queryResolver) Events(ctx context.Context) ([]*models.Event, error) {
	return []*models.Event{}, nil
}

// GetEvents is the resolver for the getEvents field.
func (r *queryResolver) GetEvents(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.EventList, error) {
	ldr := loaders.For(ctx)
	return ldr.EventReader.GetEvents(ctx, filters, orders, pagination)
}
