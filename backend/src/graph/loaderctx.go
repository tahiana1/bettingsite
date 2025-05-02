package graph

import (
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/hotbrainy/go-betting/backend/internal/loaders"
	"gorm.io/gorm"
)

// LoaderMiddleware returns an HTTP middleware that attaches the dataloaders to each request context.
func LoaderMiddleware(db *gorm.DB, next http.Handler) http.Handler {
	return loaders.Middleware(db, next)
}

// NewServerWithLoaders wraps the gqlgen server with dataloader support.
func NewServerWithLoaders(db *gorm.DB, gqlServer *handler.Server) http.Handler {
	return LoaderMiddleware(db, gqlServer)
}
