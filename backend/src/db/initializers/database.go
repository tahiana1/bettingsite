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

	// Migrate favorites column from string to integer array if needed
	if err := migrateFavoritesColumn(); err != nil {
		log.Printf("⚠️ Warning: Failed to migrate favorites column: %v", err)
		// Don't fail completely, continue with migration
	}

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

// migrateFavoritesColumn migrates the favorites column from string to integer array
func migrateFavoritesColumn() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	// Check if favorites column exists and its current type
	var columnType string
	err = sqlDB.QueryRow(`
		SELECT data_type 
		FROM information_schema.columns 
		WHERE table_name = 'profiles' AND column_name = 'favorites'
	`).Scan(&columnType)

	if err != nil {
		// Column might not exist yet, which is fine - GORM will create it
		return nil
	}

	// If already integer array, no migration needed
	if columnType == "ARRAY" {
		// Check if it's integer array specifically
		var udtName string
		err = sqlDB.QueryRow(`
			SELECT udt_name 
			FROM information_schema.columns 
			WHERE table_name = 'profiles' AND column_name = 'favorites'
		`).Scan(&udtName)
		if err == nil && udtName == "_int4" {
			return nil // Already integer array
		}
	}

	// If column is text/varchar, we need to convert it
	if columnType == "character varying" || columnType == "text" {
		// First, create a helper function to convert string to integer array
		// This handles comma-separated strings like "1,2,3" or single values like "1"
		_, err = sqlDB.Exec(`
			CREATE OR REPLACE FUNCTION text_to_int_array(text_val text)
			RETURNS integer[] AS $$
			BEGIN
				IF text_val IS NULL OR trim(text_val) = '' THEN
					RETURN NULL;
				END IF;
				RETURN (
					SELECT array_agg(trim_val::int)
					FROM unnest(string_to_array(trim(text_val), ',')) AS trim_val
					WHERE trim(trim_val) ~ '^[0-9]+$'
				);
			END;
			$$ LANGUAGE plpgsql IMMUTABLE;
		`)
		if err != nil {
			return fmt.Errorf("failed to create conversion function: %w", err)
		}

		// Now alter the column using the function
		_, err = sqlDB.Exec(`
			ALTER TABLE profiles 
			ALTER COLUMN favorites TYPE integer[] 
			USING text_to_int_array(favorites)
		`)
		if err != nil {
			// Clean up function if migration fails
			sqlDB.Exec(`DROP FUNCTION IF EXISTS text_to_int_array(text)`)
			return fmt.Errorf("failed to alter favorites column type: %w", err)
		}

		// Clean up the helper function after migration
		sqlDB.Exec(`DROP FUNCTION IF EXISTS text_to_int_array(text)`)

		fmt.Println("✅ Successfully migrated favorites column to integer array")
	}

	return nil
}
