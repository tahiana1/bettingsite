package loaders

import (
	"context"
	"net/http"
	"time"

	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/vikstrous/dataloadgen"
	"gorm.io/gorm"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

type Loaders struct {
	ProfileLoader         *dataloadgen.Loader[uint, *models.Profile]
	ProfileByUserIDLoader *dataloadgen.Loader[uint, *models.Profile]
	UserLoader            *dataloadgen.Loader[uint, *models.User]
	NotificationLoader    *dataloadgen.Loader[uint, *models.Notification]
	EventLoader           *dataloadgen.Loader[uint, *models.Event]
	DomainLoader          *dataloadgen.Loader[uint, *models.Domain]
	AnnouncementLoader    *dataloadgen.Loader[uint, *models.Announcement]
	InboxLoader           *dataloadgen.Loader[uint, *models.Inbox]
	MenuLoader            *dataloadgen.Loader[uint, *models.Menu]
	LogLoader             *dataloadgen.Loader[uint, *models.Log]
	AdminPermissionLoader *dataloadgen.Loader[uint, *models.AdminPermission]
	SettingLoader         *dataloadgen.Loader[uint, *models.Setting]
	ProfileReader         *profileReader
	UserReader            *userReader
	NotificationReader    *notificationReader
	EventReader           *eventReader
	DomainReader          *domainReader
	AnnouncementReader    *announcementReader
	InboxReader           *inboxReader
	MenuReader            *menuReader
	LogReader             *logReader
	AdminPermissionReader *adminPermissionReader
	SettingReader         *settingReader
}

func NewLoaders(db *gorm.DB) *Loaders {
	pr := &profileReader{db: db}
	ur := &userReader{db: db}
	nr := &notificationReader{db: db}
	er := &eventReader{db: db}
	dr := &domainReader{db: db}
	ar := &announcementReader{db: db}
	ir := &inboxReader{db: db}
	mr := &menuReader{db: db}
	lr := &logReader{db: db}
	adr := &adminPermissionReader{db: db}
	sr := &settingReader{db: db}

	return &Loaders{
		ProfileLoader:         dataloadgen.NewLoader(pr.getProfiles, dataloadgen.WithWait(time.Millisecond)),
		ProfileByUserIDLoader: dataloadgen.NewLoader(pr.getProfilesByUserID, dataloadgen.WithWait(time.Millisecond)),
		UserLoader:            dataloadgen.NewLoader(ur.getUsers, dataloadgen.WithWait(time.Millisecond)),
		ProfileReader:         pr,
		UserReader:            ur,
		NotificationReader:    nr,
		EventReader:           er,
		DomainReader:          dr,
		AnnouncementReader:    ar,
		InboxReader:           ir,
		MenuReader:            mr,
		LogReader:             lr,
		AdminPermissionReader: adr,
		SettingReader:         sr,
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
