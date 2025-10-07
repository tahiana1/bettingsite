package main

import (
	"log"

	"github.com/hotbrainy/go-betting/backend/config"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

func init() {
	config.LoadEnvVariables()
	initializers.ConnectDB()
}

func main() {
	// err := initializers.DB.Migrator().DropTable(models.User{}, models.Category{}, models.Post{}, models.Comment{})
	// if err != nil {
	// 	log.Fatal("Table dropping failed")
	// }

	err := initializers.DB.AutoMigrate(
		models.User{},
		models.Event{},
		models.Domain{},
		models.Category{},
		models.Post{},
		models.Comment{},
		models.Sport{},
		models.Rate{},
		models.Category{},
		models.League{},
		models.Nation{},
		models.Bet{},
		models.Fixture{},
		models.Market{},
		models.Team{},
		models.Transaction{},
		models.Announcement{},
		models.Attendance{},
		models.Inbox{},
		models.Notification{},
		models.Menu{},
		models.Bank{},
		models.CasinoBet{},
		models.Popup{},
		models.Contact{},
		models.Level{},
		models.ChargeBonusTableLevel{},
	)

	if err != nil {
		log.Fatal("Migration failed")
	}
}
