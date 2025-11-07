package initializers

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

type Policy interface {
	Resolve([]gorm.ConnPool) gorm.ConnPool
}

func ConnectDB() {
	var err error
	// dns := os.Getenv("DNS")	dbURL := os.Getenv("BACKEND_DB_URL")
	dbURL := os.Getenv("BACKEND_DB_URL")
	dbHost := os.Getenv("BACKEND_DB_HOST")
	dbUser := os.Getenv("BACKEND_DB_USER")
	dbPass := os.Getenv("BACKEND_DB_PASSWORD")
	dbName := os.Getenv("BACKEND_DB_NAME")
	dbPort := os.Getenv("BACKEND_DB_PORT")
	var dsn string
	if dbURL == "" {
		dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/?sslmode=disable",
			dbUser, dbPass, dbHost, dbPort)
	} else {
		dsn = dbURL
	}
	dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/?sslmode=disable",
		dbUser, dbPass, dbHost, dbPort)
	fmt.Println("🔍 DEBUG: BACKEND_DB_URL =", dsn)

	maxAttempts := 5
	for i := 0; i < maxAttempts; i++ {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Connection attempt %d failed: %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("❌ Failed to connect DB object: %v", err)
	}

	// Create the database if it does not exist
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("❌ Failed to get SQL DB object: %v", err)
	}

	query := "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '%s');"
	result, err := sqlDB.Exec(fmt.Sprintf(query, dbName))
	if err != nil {
		log.Fatal(err)
	}

	d, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}
	if d > 0 {
		fmt.Printf("ℹ️  Database '%s' is already existing (%d)\n", dbName, d)
	} else {
		// Execute the query to create the database
		_, err = sqlDB.Exec(fmt.Sprintf(`CREATE DATABASE  %s;`, dbName))
		if err != nil {
			fmt.Printf("⚠️ Failed to create database: %v\n", err)
			log.Fatal(err)
		} else {
			fmt.Printf("✅ Database '%s' created (if it did not already exist)\n", dbName)
		}
	}
	// Now reconnect to the newly created database
	dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbPort, dbName)
	// Now connect to the newly created database
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	// DB.Use(dbresolver.Register(dbresolver.Config{
	// 	Sources: []gorm.Dialector{postgres.Open(dsn)},
	// 	Replicas: []gorm.Dialector{postgres.Open(fmt.Sprintf("postgres://%s:%s@%s:%s/?sslmode=disable",
	// 		dbUser, dbPass, dbHost, "5433"))},
	// 	Policy:            dbresolver.RandomPolicy{},
	// 	TraceResolverMode: true,
	// }))

	fmt.Println("✅ Successfully connected to the database!")

	err = DB.AutoMigrate(
		models.User{},
		models.Profile{},
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
		models.Log{},
		models.AdminPermission{},
		models.AdminMenu{},
		models.Bank{},
		models.SMSApi{},
		models.Qna{},
		models.GameAPI{},
		models.CasinoBet{},
		models.Popup{},
		models.Contact{},
		models.Level{},
		models.SurpriseBonus{},
		models.ChargeBonusTableLevel{},
		models.MiniBetOption{},
		models.MiniGameConfig{},
		models.PowerballHistory{},
	)

	if err != nil {
		log.Fatal("⛔ Migration failed")
	} else {
		fmt.Println("🟢 Successfully migrated!")
	}

}
