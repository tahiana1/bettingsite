package loaders

import (
	"context"
	"net/http"
	"time"

	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/vikstrous/dataloadgen"
	"gorm.io/gorm"
)

const (
	loadersKey = ctxKey("dataloaders")
)

type Loaders struct {
	ProfileLoader         *dataloadgen.Loader[uint, *models.Profile]
	ProfileByUserIDLoader *dataloadgen.Loader[uint, *models.Profile]
	UserLoader            *dataloadgen.Loader[uint, *models.User]
	ProfileReader         *profileReader
	UserReader            *userReader
}

func NewLoaders(db *gorm.DB) *Loaders {
	pr := &profileReader{db: db}
	ur := &userReader{db: db}

	return &Loaders{
		ProfileLoader:         dataloadgen.NewLoader(pr.getProfiles, dataloadgen.WithWait(time.Millisecond)),
		ProfileByUserIDLoader: dataloadgen.NewLoader(pr.getProfilesByUserID, dataloadgen.WithWait(time.Millisecond)),
		UserLoader:            dataloadgen.NewLoader(ur.getUsers, dataloadgen.WithWait(time.Millisecond)),
		ProfileReader:         pr,
		UserReader:            ur,
	}
}

// Middleware injects data loaders into the context
func Middleware(db *gorm.DB, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		loaders := NewLoaders(db)
		ctx := context.WithValue(r.Context(), loadersKey, loaders)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}
