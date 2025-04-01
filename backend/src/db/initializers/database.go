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
	// Execute the query to create the database
	_, err = sqlDB.Exec(fmt.Sprintf(`CREATE DATABASE  %s;`, dbName))
	if err != nil {
		fmt.Printf("❌ Failed to create database: %v", err)
	}
	fmt.Printf("✅ Database '%s' created (if it did not already exist)\n", dbName)

	// Now reconnect to the newly created database
	dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbPort, dbName)
	// Now connect to the newly created database
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	fmt.Println("✅ Successfully connected to the database!")
	if err != nil {
		panic("Database connection failed!")
	}
	// Migration
	// err = DB.Migrator().DropTable(models.User{}, models.Category{}, models.Post{}, models.Comment{})
	// if err != nil {
	// 	log.Fatal("Table dropping failed")
	// }

	err = DB.AutoMigrate(models.User{}, models.Category{}, models.Post{}, models.Comment{})

	if err != nil {
		log.Fatal("Migration failed")
	}
}
